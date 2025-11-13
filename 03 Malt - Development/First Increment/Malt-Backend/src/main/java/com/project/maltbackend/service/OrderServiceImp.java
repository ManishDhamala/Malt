package com.project.maltbackend.service;

import com.project.maltbackend.controller.OrderWebSocketController;
import com.project.maltbackend.dto.*;
import com.project.maltbackend.model.*;
import com.project.maltbackend.repository.*;
import com.project.maltbackend.request.OrderRequest;
import com.project.maltbackend.response.PaymentResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderServiceImp implements OrderService {

    private final OrderRepository orderRepository;

    private final OrderItemRepository orderItemRepository;

    private final AddressRepository addressRepository;

    private final UserRepository userRepository;

    private final RestaurantService restaurantService;

    private final CartService cartService;

    private final PaymentRepository paymentRepository;

    private final PaymentService paymentService;

    private final EsewaService esewaService;

    private final KhaltiService khaltiService;

    private final EmailService emailService;

    private final NotificationService notificationService;

    private  final OrderWebSocketController orderWebSocketController;

    private final int deliveryCharge = 100;

    private final int restaurantCharge = 10;


    @Transactional
    @Override
    public Object createOrder(OrderRequest request, User user) throws Exception {

        // Step 1: Address Object
        Address finalAddress;

        if (request.getAddressId() != null) {
            finalAddress = addressRepository.findById(request.getAddressId())
                    .orElseThrow(() -> new Exception("Address not found"));
            if (!user.getAddresses().contains(finalAddress)) {  // Check if the found address belong to the user
                throw new Exception("Unauthorized address access");
            }
        } else if (request.getDeliveryAddress() != null) {
            Address deliveryAddress = request.getDeliveryAddress();
            deliveryAddress.setUser(user);
            Address savedAddress = addressRepository.save(deliveryAddress);

            if (deliveryAddress.isSavedAddress() && !user.getAddresses().contains(savedAddress)) {
                user.getAddresses().add(savedAddress);
                userRepository.save(user);
            }

            finalAddress = savedAddress;
        } else {
            throw new Exception("No delivery address provided");
        }

        // Step 2: Create Order
        Restaurant restaurant = restaurantService.findRestaurantById(request.getRestaurantId());
        Cart cart = cartService.findCartByUserId(user.getId());

        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setFood(cartItem.getFood());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setTotalPrice(cartItem.getTotalPrice());
            orderItems.add(orderItemRepository.save(orderItem));
        }

        Long subtotal = cartService.calculateCartTotals(cart);
        Long finalTotal = subtotal + deliveryCharge + restaurantCharge;

        Order order = new Order();
        order.setCustomer(user);
        order.setRestaurant(restaurant);
        order.setCreatedAt(new Date());

        // Default order status
        String orderStatus = "CANCELLED";

        // Only set to pending for COD
        if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {
            orderStatus = "PENDING";
        }

        order.setOrderStatus(orderStatus);
        order.setDeliveryAddress(finalAddress);
        order.setItems(orderItems);
        order.setTotalPrice(finalTotal);
        Order savedOrder = orderRepository.save(order);


        // Step 3: Send WebSocket notification for new order
        try {
            OrderDto orderDto = convertToDto(savedOrder);
            orderWebSocketController.notifyNewOrder(savedOrder.getRestaurant().getId(), orderDto);
        } catch (Exception e) {
            // Don't fail the order creation if WebSocket fails
            System.out.println("Failed to send WebSocket notification for new order: " + e);
        }

        // Step 4: Save Payment Info
        Payment payment = new Payment();
        payment.setPaymentMethod(request.getPaymentMethod());

        // Set default status as "FAILED"
        String paymentStatus = "FAILED";

        // Only set to "PENDING" for COD
        if ("COD".equalsIgnoreCase(request.getPaymentMethod())) {
            paymentStatus = "PENDING";
            notificationService.createOrderNotification(user, savedOrder);
        }

        payment.setStatus(paymentStatus);
        payment.setPaid(false);
        payment.setAmount(finalTotal);
        payment.setOrder(savedOrder);
        paymentRepository.save(payment);

        restaurant.getOrders().add(savedOrder); // updating restaurant orders

        // Step 5: Payment Handling
        switch (request.getPaymentMethod().toUpperCase()) {
            case "COD":
                sendOrderConfirmationEmail(user, savedOrder, finalAddress, restaurant, orderItems, subtotal);
                return savedOrder;

            case "STRIPE":
                PaymentResponse stripeResponse = paymentService.createPaymentLink(savedOrder);
                return new OrderWithPaymentLink(savedOrder, stripeResponse.getPayment_url());

            case "ESEWA":
                PaymentResponse esewaResponse = esewaService.createEsewaPaymentLink(savedOrder);

                // Prepare a map to hold information related to the payment request
                Map<String, Object> esewaMap = new HashMap<>();
                // Adding data to the map in key & value pair
                esewaMap.put("order", savedOrder);
                esewaMap.put("paymentProvider", "ESEWA");
                esewaMap.put("signature", esewaResponse.getSignature());  // Add the payment signature returned by the eSewa service to the map
                esewaMap.put("signedFieldNames", esewaResponse.getSignedFieldNames());

                return esewaMap;

            case "KHALTI":
                PaymentResponse khaltiResponse = khaltiService.createKhaltiPayment(savedOrder);

                Map<String, Object> khaltiMap = new HashMap<>();
                khaltiMap.put("order", savedOrder);
                khaltiMap.put("paymentProvider", "KHALTI");
                khaltiMap.put("payment_url", khaltiResponse.getPayment_url());
                return khaltiMap;


            default:
                throw new IllegalArgumentException("Invalid payment method: " + request.getPaymentMethod());
        }
    }


    @Override
    public OrderDto updateOrder(Long orderId, String orderStatus) throws Exception {
        Order order = findOrderById(orderId);
        String previousStatus = order.getOrderStatus();

        if (orderStatus.equals("PENDING")
                || orderStatus.equals("CONFIRMED")
                || orderStatus.equals("OUT_FOR_DELIVERY")
                || orderStatus.equals("DELIVERED")) {

            // Prevent re-sending email for already updated status
            if (orderStatus.equals(order.getOrderStatus())) {
                System.out.println(" Order is already in status: " + orderStatus + ". Skipping email.");
                return convertToDto(order); // Return DTO instead of entity
            }

            order.setOrderStatus(orderStatus);
            Order updatedOrder = orderRepository.save(order);

            // Create notification for status update
            notificationService.createOrderStatusNotification(order.getCustomer(), updatedOrder, previousStatus);

            switch (orderStatus) {
                case "OUT_FOR_DELIVERY":
                case "DELIVERED":
                    String templateName = orderStatus.equals("OUT_FOR_DELIVERY")
                            ? "order_out_for_delivery.html"
                            : "order_delivered.html";

                    String template = emailService.loadTemplate(templateName);
                    String htmlContent = template
                            .replace("[[name]]", order.getCustomer().getFullName())
                            .replace("[[orderId]]", String.valueOf(order.getId()));

                    try {
                        emailService.sendHtmlEmail(
                                order.getCustomer().getEmail(),
                                orderStatus.equals("OUT_FOR_DELIVERY")
                                        ? "Your Order Is On The Way!"
                                        : "Order Delivered Successfully",
                                htmlContent
                        );
                    } catch (Exception e) {
                        log.error("Failed to send status update email", e);
                    }
                    break;

                case "CONFIRMED":
                    try {
                        Long subtotal = order.getTotalPrice() - deliveryCharge - restaurantCharge;
                        sendOrderConfirmationEmail(
                                order.getCustomer(),
                                order,
                                order.getDeliveryAddress(),
                                order.getRestaurant(),
                                order.getItems(),
                                subtotal
                        );
                    } catch (Exception e) {
                        log.error("Failed to send confirmation email", e);
                    }
                    break;
            }

            return convertToDto(updatedOrder); // Return DTO of updated order
        }

        throw new Exception("Please select a valid order status");
    }


    public void sendOrderConfirmationEmail(User user, Order order, Address address, Restaurant restaurant, List<OrderItem> items, Long subtotal) {
        try {
            String template = emailService.loadTemplate("order_confirmation.html");

            StringBuilder itemsHtml = new StringBuilder();
            for (OrderItem item : items) {
                itemsHtml.append("<tr>")
                        .append("<td>").append(item.getFood().getName()).append("</td>")
                        .append("<td>").append(item.getQuantity()).append("</td>")
                        .append("<td>").append(item.getTotalPrice()).append("</td>")
                        .append("</tr>");
            }

            String htmlContent = template
                    .replace("[[name]]", user.getFullName())
                    .replace("[[orderId]]", String.valueOf(order.getId()))
                    .replace("[[restaurantName]]", restaurant.getName())
                    .replace("[[status]]", order.getOrderStatus())
                    .replace("[[deliveryAddress]]",
                            address.getStreetAddress() + ", " +
                                    address.getCity() + ", " +
                                    address.getProvince()
                    )
                    .replace("[[orderItems]]", itemsHtml.toString())
                    .replace("[[subtotal]]", String.valueOf(subtotal))
                    .replace("[[deliveryCharge]]", String.valueOf(deliveryCharge))
                    .replace("[[restaurantCharge]]", String.valueOf(restaurantCharge))
                    .replace("[[totalPrice]]", String.valueOf(order.getTotalPrice()));

            System.out.println("Sending confirmation email to {}" + user.getEmail());


            emailService.sendHtmlEmail(user.getEmail(), "Your Order Confirmation - Malt", htmlContent);

        } catch (Exception e) {
            log.error("Failed to send order created email", e);
        }
    }


    @Override
    public void cancelOrder(Long orderId) throws Exception {
        orderRepository.deleteById(orderId);
    }


    @Transactional(readOnly = true)
    @Override
    public PaginatedResponse<OrderDto> getRestaurantsOrders(
            Long restaurantId,
            String orderStatus,
            Integer year,
            Integer month,
            int page,
            int size) throws Exception {

        Page<Order> ordersPage;
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        // Create base specification to filters orders by restaurantID
        Specification<Order> spec = (root, query, cb) ->
                cb.equal(root.get("restaurant").get("id"), restaurantId);

        // Order Status filter
        if (orderStatus != null && !orderStatus.equalsIgnoreCase("all")) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(root.get("orderStatus"), orderStatus));
        } else {
            // When "all" or null is passed, exclude CANCELLED orders
            spec = spec.and((root, query, cb) ->
                    cb.notEqual(root.get("orderStatus"), "CANCELLED"));
        }

        // For year filter
        if (year != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(
                            cb.function("date_part", Integer.class,  // Use a database function "date_part" to extract the year part of the createdAt timestamp
                                    cb.literal("year"),
                                    root.get("createdAt")),
                            year));
        }

        // For month filter
        if (month != null) {
            spec = spec.and((root, query, cb) ->
                    cb.equal(
                            cb.function("date_part", Integer.class,
                                    cb.literal("month"),
                                    root.get("createdAt")),
                            month + 1));
        }

        //  fetching the paginated list of orders by matching the built specification
        ordersPage = orderRepository.findAll(spec, pageable);
        Page<OrderDto> dtoPage = ordersPage.map(this::convertToDto);
        return new PaginatedResponse<>(dtoPage);
    }


    @Transactional(readOnly = true)
    @Override
    public List<OrderDto> getUsersOrders(Long userId) throws Exception {
        // Finding Orders on the basis of customer Id and excluding Cancelled orders
        List<Order> orders = orderRepository.findByCustomerIdAndOrderStatusNot(userId, "CANCELLED");
        return orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }


    private OrderDto convertToDto(Order order) {
        boolean canReview = "DELIVERED".equalsIgnoreCase(order.getOrderStatus()) && order.getReview() == null;
        return new OrderDto(
                order.getId(),
                convertUserToDto(order.getCustomer()),
                convertRestaurantToDto(order.getRestaurant()),
                order.getTotalPrice(),
                order.getOrderStatus(),
                order.getCreatedAt(),
                convertAddressToDto(order.getDeliveryAddress()),
                convertOrderItemsToDto(order.getItems()),
                convertPaymentToDto(order.getPayment()),
                canReview
        );
    }

    private UserDto convertUserToDto(User user) {
        // Simplified example
        return new UserDto(user.getId(), user.getFullName(), user.getEmail(), user.getRole());
    }


    // Updated converter method with enhanced mapping
    private RestaurantDto convertRestaurantToDto(Restaurant restaurant) {
        Address address = restaurant.getAddress();

        AddressDto addressDto = null;
        if (address != null) {
            addressDto = new AddressDto(
                    address.getId(),
                    address.getStreetAddress(),
                    address.getCity(),
                    address.getProvince(),
                    address.getPostalCode(),
                    address.getCountry(),
                    address.getLandmark()
            );
        }

        ContactInformation contactInformation = null;
        if (restaurant.getContactInformation() != null) {
            contactInformation = new ContactInformation(
                    restaurant.getContactInformation().getMobile(),
                    restaurant.getContactInformation().getEmail(),
                    restaurant.getContactInformation().getTwitter(),
                    restaurant.getContactInformation().getInstagram()
            );
        }

        // Calculate average rating if reviews exist
        Double averageRating = null;
        if (restaurant.getReviews() != null && !restaurant.getReviews().isEmpty()) {
            averageRating = restaurant.getReviews().stream()
                    .mapToDouble(Review::getRating)
                    .average()
                    .orElse(0.0);
        }

        return new RestaurantDto(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getImages(),
                restaurant.getOpeningHours(),
                restaurant.getDescription(),
                addressDto,
                contactInformation,
                restaurant.isOpen(),
                averageRating,
                restaurant.getReviews() != null ? restaurant.getReviews().size() : 0
        );
    }


    private AddressDto convertAddressToDto(Address address) {
        return new AddressDto(address.getId(), address.getStreetAddress(), address.getCity(), address.getProvince(), address.getPostalCode(), address.getCountry(), address.getLandmark());
    }

    private List<OrderItemDto> convertOrderItemsToDto(List<OrderItem> items) {
        return items.stream()
                .map(item -> new OrderItemDto(item.getId(), item.getQuantity(), convertFoodToDto(item.getFood()), item.getTotalPrice()))
                .collect(Collectors.toList());
    }

    private PaymentDto convertPaymentToDto(Payment payment) {
        if (payment == null) return null;
        return new PaymentDto(payment.getId(), payment.getPaymentMethod(), payment.isPaid(), payment.getStatus(), payment.getPaidAt(), payment.getAmount(), payment.getOrder().getId());
    }

    private FoodDto convertFoodToDto(Food food) {
        return new FoodDto(
                food.getId(),
                food.getName(),
                food.getDescription(),
                food.getPrice(),
                food.isVegetarian(),
                food.isAvailable(),
                food.getImages()
        );
    }


    @Override
    public Order findOrderById(Long orderId) throws Exception {
        Optional<Order> optionalOrder = orderRepository.findById(orderId);
        if (optionalOrder.isEmpty()) {
            throw new Exception("Order not found");
        }
        return optionalOrder.get();
    }


}
