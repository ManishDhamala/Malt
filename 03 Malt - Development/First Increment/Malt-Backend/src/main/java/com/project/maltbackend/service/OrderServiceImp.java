package com.project.maltbackend.service;

import com.project.maltbackend.model.*;
import com.project.maltbackend.repository.AddressRepository;
import com.project.maltbackend.repository.OrderItemRepository;
import com.project.maltbackend.repository.OrderRepository;
import com.project.maltbackend.repository.UserRepository;
import com.project.maltbackend.request.OrderRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
public class OrderServiceImp implements OrderService{

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private CartService cartService;

    @Autowired
    private EmailService emailService;

    private int deliveryCharge = 100;

    private int restaurantCharge = 10;



    @Override
    public Order createOrder(OrderRequest request, User user) throws Exception {

        Address finalAddress;

        if (request.getAddressId() != null) {
            finalAddress = addressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new Exception("Address not found"));

            // Optional: Verify user owns the address
            if (!user.getAddresses().contains(finalAddress)) {
                throw new Exception("Unauthorized address access");
            }

        } else if (request.getDeliveryAddress() != null) {
            Address deliveryAddress = request.getDeliveryAddress();
            deliveryAddress.setUser(user);
            Address savedAddress = addressRepository.save(deliveryAddress);

            // Save only if marked as savedAddress
            if (deliveryAddress.isSavedAddress() && !user.getAddresses().contains(savedAddress)) {
                user.getAddresses().add(savedAddress);
                userRepository.save(user);
            }

            finalAddress = savedAddress;
        } else {
            throw new Exception("No delivery address provided");
        }

        Restaurant restaurant = restaurantService.findRestaurantById(request.getRestaurantId());

        Order createOrder = new Order();
        createOrder.setCustomer(user);
        createOrder.setRestaurant(restaurant);
        createOrder.setCreatedAt(new Date());
        createOrder.setOrderStatus("PENDING");
        createOrder.setDeliveryAddress(finalAddress);

        Cart cart = cartService.findCartByUserId(user.getId());

        List<OrderItem> orderItems = new ArrayList<>();

        for(CartItem cartItem : cart.getItems()){

            OrderItem orderItem = new OrderItem();

            orderItem.setFood(cartItem.getFood());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getTotalPrice());

            OrderItem savedOrderItem = orderItemRepository.save(orderItem);
            orderItems.add(savedOrderItem);
        }

//        Long totalPrice = cartService.calculateCartTotals(cart); //check this
        Long subtotal = cartService.calculateCartTotals(cart);
        Long finalTotal = subtotal + deliveryCharge + restaurantCharge;

        createOrder.setItems(orderItems);
        createOrder.setTotalPrice(finalTotal);

        Order savedOrder = orderRepository.save(createOrder);

        // 1. Load template
        String template = emailService.loadTemplate("order_confirmation.html");

// 2. Build order items HTML
        StringBuilder itemsHtml = new StringBuilder();
        for (OrderItem item : orderItems) {
            itemsHtml.append("<tr>")
                    .append("<td>").append(item.getFood().getName()).append("</td>")
                    .append("<td>").append(item.getQuantity()).append("</td>")
                    .append("<td>").append(item.getTotalPrice()).append("</td>")
                    .append("</tr>");
        }

// 3. Replace placeholders
        String htmlContent = template
                .replace("[[name]]", user.getFullName())
                .replace("[[orderId]]", String.valueOf(savedOrder.getId()))
                .replace("[[restaurantName]]", restaurant.getName())
                .replace("[[status]]", savedOrder.getOrderStatus())
                .replace("[[deliveryAddress]]",
                        finalAddress.getStreetAddress() + ", " +
                                finalAddress.getCity() + ", " +
                                finalAddress.getProvince()
                )
                .replace("[[orderItems]]", itemsHtml.toString())
                .replace("[[subtotal]]", String.valueOf(subtotal))
                .replace("[[deliveryCharge]]", String.valueOf(deliveryCharge))
                .replace("[[restaurantCharge]]", String.valueOf(restaurantCharge))
                .replace("[[totalPrice]]", String.valueOf(finalTotal));

// 4. Send email
        try {
            emailService.sendHtmlEmail(user.getEmail
                    (), "Your Order Confirmation - Malt", htmlContent);
        }catch (Exception e){
            log.error("Failed to send order created email", e);
        }

        restaurant.getOrders().add(savedOrder);

        return createOrder;
    }



//    @Override
//    public Order updateOrder(Long orderId, String orderStatus) throws Exception {
//        Order order = findOrderById(orderId);
//        if(orderStatus.equals("OUT_FOR_DELIVERY")
//                || orderStatus.equals("DELIVERED")
//                || orderStatus.equals("PENDING")
//        ){
//            order.setOrderStatus(orderStatus);
//            return orderRepository.save(order);
//
//        }
//        throw new Exception("Please select a valid order status");
//    }

    @Override
    public Order updateOrder(Long orderId, String orderStatus) throws Exception {
        Order order = findOrderById(orderId);

        if(orderStatus.equals("OUT_FOR_DELIVERY")
                || orderStatus.equals("DELIVERED")
                || orderStatus.equals("PENDING")) {

            order.setOrderStatus(orderStatus);
            Order updatedOrder = orderRepository.save(order);

            // Send email only for OUT_FOR_DELIVERY or DELIVERED
            if(orderStatus.equals("OUT_FOR_DELIVERY") || orderStatus.equals("DELIVERED")) {

                String templateName = orderStatus.equals("OUT_FOR_DELIVERY")
                        ? "order_out_for_delivery.html"
                        : "order_delivered.html";

                String template = emailService.loadTemplate(templateName);
                String htmlContent = template
                        .replace("[[name]]", order.getCustomer().getFullName())
                        .replace("[[orderId]]", String.valueOf(order.getId()));

                try {
                    emailService.sendHtmlEmail(order.getCustomer().getEmail(),
                            orderStatus.equals("OUT_FOR_DELIVERY") ? "Your Order Is On The Way!" : "Order Delivered Successfully",
                            htmlContent);
                } catch (Exception e) {
                    log.error("Failed to send status update email", e);
                }
            }

            return updatedOrder;
        }

        throw new Exception("Please select a valid order status");
    }


    @Override
    public void cancelOrder(Long orderId) throws Exception {

        Order order =  findOrderById(orderId);
        orderRepository.deleteById(orderId);

    }

    @Override
    public List<Order> getUsersOrders(Long userId) throws Exception {
        return orderRepository.findByCustomerId(userId);
    }

    @Override
    public List<Order> getRestaurantsOrders(Long restaurantId, String orderStatus) throws Exception {
        List<Order> orders =  orderRepository.findByRestaurantId(restaurantId);

        if(orderStatus != null){
            orders = orders.stream().filter(order ->
                    order.getOrderStatus().equals(orderStatus)).collect(Collectors.toList());
        }

        return orders;
    }

    @Override
    public Order findOrderById(Long orderId) throws Exception {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if(optionalOrder.isEmpty()){
            throw new Exception("Order not found");
        }
        return optionalOrder.get();
    }


}
