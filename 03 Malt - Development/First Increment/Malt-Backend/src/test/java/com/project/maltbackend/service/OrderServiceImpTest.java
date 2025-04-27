package com.project.maltbackend.service;

import com.project.maltbackend.dto.OrderWithPaymentLink;
import com.project.maltbackend.model.*;
import com.project.maltbackend.repository.*;
import com.project.maltbackend.request.OrderRequest;
import com.project.maltbackend.response.PaymentResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceImpTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RestaurantService restaurantService;

    @Mock
    private CartService cartService;

    @Mock
    private PaymentRepository paymentRepository;

    @Mock
    private PaymentService paymentService;

    @Mock
    private EmailService emailService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private OrderServiceImp orderService;

    private OrderRequest request;
    private User user;
    private Restaurant restaurant;
    private Cart cart;
    private Address address;
    private Order expectedOrder;
    private Payment expectedPayment;

    @BeforeEach
    void setUp() {
        // Initialize test data
        user = new User();
        user.setId(1L);
        user.setFullName("Test User");
        user.setEmail("test@example.com");
        user.setAddresses(new ArrayList<>());

        restaurant = new Restaurant();
        restaurant.setId(1L);
        restaurant.setName("Test Restaurant");
        restaurant.setOrders(new ArrayList<>());

        address = new Address();
        address.setId(1L);
        address.setStreetAddress("123 Test St");
        address.setCity("Test City");
        address.setProvince("Test Province");
        address.setPostalCode("12345");
        address.setCountry("Test Country");
        address.setUser(user);

        cart = new Cart();
        cart.setItems(new ArrayList<>());

        CartItem cartItem = new CartItem();
        cartItem.setId(1L);
        cartItem.setQuantity(2);
        cartItem.setTotalPrice(2000L);

        Food food = new Food();
        food.setId(1L);
        food.setName("Test Food");
        food.setPrice(1000L);
        cartItem.setFood(food);

        cart.getItems().add(cartItem);

        request = new OrderRequest();
        request.setRestaurantId(1L);
        request.setPaymentMethod("COD");
        request.setAddressId(1L);

        expectedOrder = new Order();
        expectedOrder.setId(1L);
        expectedOrder.setCustomer(user);
        expectedOrder.setRestaurant(restaurant);
        expectedOrder.setDeliveryAddress(address);
        expectedOrder.setTotalPrice(2110L); // 2000 + 100 + 10
        expectedOrder.setOrderStatus("PENDING");
        expectedOrder.setCreatedAt(new Date());

        expectedPayment = new Payment();
        expectedPayment.setId(1L);
        expectedPayment.setOrder(expectedOrder);
        expectedPayment.setPaymentMethod("COD");
        expectedPayment.setStatus("PENDING");
        expectedPayment.setAmount(2110L);
        expectedPayment.setPaid(false);
    }


    @Test
    void createOrder_WithNewAddress_ShouldCreateOrderSuccessfully() throws Exception {
        // Arrange
        request.setAddressId(null);
        request.setDeliveryAddress(address);

        when(addressRepository.save(any(Address.class))).thenReturn(address);
        when(restaurantService.findRestaurantById(anyLong())).thenReturn(restaurant);
        when(cartService.findCartByUserId(anyLong())).thenReturn(cart);
        when(cartService.calculateCartTotals(any(Cart.class))).thenReturn(2000L);
        when(orderItemRepository.save(any(OrderItem.class))).thenAnswer(invocation -> {
            OrderItem item = invocation.getArgument(0);
            item.setId(1L);
            return item;
        });
        when(orderRepository.save(any(Order.class))).thenReturn(expectedOrder);
        when(paymentRepository.save(any(Payment.class))).thenReturn(expectedPayment);

        // Act
        Order result = (Order) orderService.createOrder(request, user);

        // Assert
        assertNotNull(result);
        assertEquals(address, result.getDeliveryAddress());
        verify(addressRepository).save(address);
    }

    @Test
    void createOrder_WithUnauthorizedAddress_ShouldThrowException() throws Exception {
        // Arrange
        Address otherUserAddress = new Address();
        otherUserAddress.setId(2L);
        otherUserAddress.setUser(new User()); // Different user

        when(addressRepository.findById(anyLong())).thenReturn(Optional.of(otherUserAddress));

        // Act & Assert
        Exception exception = assertThrows(Exception.class, () -> {
            orderService.createOrder(request, user);
        });

        assertEquals("Unauthorized address access", exception.getMessage());
        verify(orderRepository, never()).save(any(Order.class));
    }

    @Test
    void createOrder_WithNoAddress_ShouldThrowException() {
        // Arrange
        request.setAddressId(null);
        request.setDeliveryAddress(null);

        // Act & Assert
        Exception exception = assertThrows(Exception.class, () -> {
            orderService.createOrder(request, user);
        });

        assertEquals("No delivery address provided", exception.getMessage());
        verify(orderRepository, never()).save(any(Order.class));
    }



}