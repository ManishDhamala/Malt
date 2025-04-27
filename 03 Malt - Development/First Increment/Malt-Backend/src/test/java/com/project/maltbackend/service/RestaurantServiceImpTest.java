package com.project.maltbackend.service;

import com.project.maltbackend.model.*;
import com.project.maltbackend.repository.*;
import com.project.maltbackend.request.CreateRestaurantRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RestaurantServiceImpTest {

    @Mock
    private RestaurantRepository restaurantRepository;

    @Mock
    private AddressRepository addressRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CartItemRepository cartItemRepository;

    @InjectMocks
    private RestaurantServiceImp restaurantService;

    private CreateRestaurantRequest request;
    private User user;
    private Address address;
    private ContactInformation contactInfo;
    private Restaurant expectedRestaurant;

    @BeforeEach
    void setUp() {
        // Setup test data
        user = new User();
        user.setId(1L);
        user.setEmail("owner@test.com");
        user.setFullName("Test Owner");

        address = new Address();
        address.setStreetAddress("123 Test St");
        address.setCity("Test City");
        address.setProvince("Test Province");
        address.setPostalCode("12345");
        address.setCountry("Test Country");

        contactInfo = new ContactInformation();
        contactInfo.setEmail("contact@test.com");
        contactInfo.setMobile("1234567890");

        request = new CreateRestaurantRequest();
        request.setName("Test Restaurant");
        request.setDescription("Test Description");
        request.setAddress(address);
        request.setContactInformation(contactInfo);
        request.setOpeningHours("9AM-5PM");
        request.setImages(List.of("image1.jpg", "image2.jpg"));

        expectedRestaurant = new Restaurant();
        expectedRestaurant.setId(1L);
        expectedRestaurant.setName(request.getName());
        expectedRestaurant.setDescription(request.getDescription());
        expectedRestaurant.setAddress(address);
        expectedRestaurant.setContactInformation(contactInfo);
        expectedRestaurant.setOpeningHours(request.getOpeningHours());
        expectedRestaurant.setImages(request.getImages());
        expectedRestaurant.setOwner(user);
        expectedRestaurant.setRegistrationDate(LocalDateTime.now());
    }

    @Test
    void createRestaurant_ShouldSuccessfullyCreateRestaurant() {
        // Arrange
        when(addressRepository.save(any(Address.class))).thenReturn(address);
        when(restaurantRepository.save(any(Restaurant.class))).thenReturn(expectedRestaurant);

        // Act
        Restaurant result = restaurantService.createRestaurant(request, user);

        // Assert
        assertNotNull(result);
        assertEquals(request.getName(), result.getName());
        assertEquals(request.getDescription(), result.getDescription());
        assertEquals(address, result.getAddress());
        assertEquals(contactInfo, result.getContactInformation());
        assertEquals(request.getOpeningHours(), result.getOpeningHours());
        assertEquals(request.getImages(), result.getImages());
        assertEquals(user, result.getOwner());
        assertNotNull(result.getRegistrationDate());

        // Verify repository interactions
        verify(addressRepository, times(1)).save(any(Address.class));
        verify(restaurantRepository, times(1)).save(any(Restaurant.class));
    }

    @Test
    void createRestaurant_ShouldThrowExceptionWhenRequestIsNull() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            restaurantService.createRestaurant(null, user);
        });

        assertEquals("Create Restaurant request or User must not be null", exception.getMessage());
        verifyNoInteractions(addressRepository, restaurantRepository);
    }

    @Test
    void createRestaurant_ShouldThrowExceptionWhenUserIsNull() {
        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            restaurantService.createRestaurant(request, null);
        });

        assertEquals("Create Restaurant request or User must not be null", exception.getMessage());
        verifyNoInteractions(addressRepository, restaurantRepository);
    }

    @Test
    void createRestaurant_ShouldSetCurrentRegistrationDate() {
        // Arrange
        LocalDateTime beforeTest = LocalDateTime.now();
        when(addressRepository.save(any(Address.class))).thenReturn(address);
        when(restaurantRepository.save(any(Restaurant.class))).thenReturn(expectedRestaurant);

        // Act
        Restaurant result = restaurantService.createRestaurant(request, user);
        LocalDateTime afterTest = LocalDateTime.now();

        // Assert
        assertNotNull(result.getRegistrationDate());
        assertTrue(result.getRegistrationDate().isAfter(beforeTest) ||
                result.getRegistrationDate().equals(beforeTest));
        assertTrue(result.getRegistrationDate().isBefore(afterTest) ||
                result.getRegistrationDate().equals(afterTest));
    }

    @Test
    void createRestaurant_ShouldSaveAddressBeforeRestaurant() {
        // Arrange
        when(addressRepository.save(any(Address.class))).thenReturn(address);
        when(restaurantRepository.save(any(Restaurant.class))).thenReturn(expectedRestaurant);

        // Act
        restaurantService.createRestaurant(request, user);

        // Verify the order of repository calls
        InOrder inOrder = inOrder(addressRepository, restaurantRepository);
        inOrder.verify(addressRepository).save(any(Address.class));
        inOrder.verify(restaurantRepository).save(any(Restaurant.class));
    }
}