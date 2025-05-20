package com.project.maltbackend.service;

import com.project.maltbackend.dto.AddressDto;
import com.project.maltbackend.dto.FavoriteRestaurant;
import com.project.maltbackend.dto.RestaurantDto;
import com.project.maltbackend.model.*;
import com.project.maltbackend.repository.AddressRepository;
import com.project.maltbackend.repository.CartItemRepository;
import com.project.maltbackend.repository.RestaurantRepository;
import com.project.maltbackend.repository.UserRepository;
import com.project.maltbackend.request.CreateRestaurantRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RestaurantServiceImp implements RestaurantService{

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    // Method to create a new restaurant based on the request data and the user
    @Override
    public Restaurant createRestaurant(CreateRestaurantRequest req, User user) {

        // Validate input
        if (req == null || user == null) {
            throw new IllegalArgumentException("Create Restaurant request or User must not be null");
        }

        // Create and save the Address entity before setting it in Restaurant
        Address address = new Address();
        address.setStreetAddress(req.getAddress().getStreetAddress()); // landmark is missing
        address.setCity(req.getAddress().getCity());
        address.setProvince(req.getAddress().getProvince());
        address.setPostalCode(req.getAddress().getPostalCode());
        address.setCountry(req.getAddress().getCountry());

        Address savedAddress = addressRepository.save(address); // Save it properly

        Restaurant restaurant = new Restaurant();
        restaurant.setAddress(savedAddress);
        restaurant.setContactInformation(req.getContactInformation());
        restaurant.setDescription(req.getDescription());
        restaurant.setImages(req.getImages());
        restaurant.setName(req.getName());
        restaurant.setOpeningHours(req.getOpeningHours());
        restaurant.setRegistrationDate(LocalDateTime.now());
        restaurant.setOwner(user);


        return restaurantRepository.save(restaurant);
    }

    // Method to update an existing restaurant's details
    @Override
    public Restaurant updateRestaurant(Long restaurantId, CreateRestaurantRequest updatedRestaurant) throws Exception {

        Restaurant restaurant= findRestaurantById(restaurantId);

        // Update fields if provided in the request
        if(updatedRestaurant.getName() != null){
            restaurant.setName(updatedRestaurant.getName());
        }

        if(updatedRestaurant.getDescription() != null){
            restaurant.setDescription(updatedRestaurant.getDescription());
        }

        if(updatedRestaurant.getImages() != null){
            restaurant.setImages(updatedRestaurant.getImages());
        }

        if(updatedRestaurant.getOpeningHours() != null){
            restaurant.setOpeningHours(updatedRestaurant.getOpeningHours());
        }

        if (updatedRestaurant.getAddress() != null) {
            Address address = restaurant.getAddress();
            Address updated = updatedRestaurant.getAddress();

            if (address == null) {
                address = new Address();
            }

            address.setStreetAddress(updated.getStreetAddress());
            address.setCity(updated.getCity());
            address.setProvince(updated.getProvince());
            address.setPostalCode(updated.getPostalCode());
            address.setCountry(updated.getCountry());

            restaurant.setAddress(address); // Ensure it's linked back
        }

        if (updatedRestaurant.getContactInformation() != null) {
            ContactInformation contact = restaurant.getContactInformation();
            ContactInformation updated = updatedRestaurant.getContactInformation();

            if (contact == null) {
                contact = new ContactInformation();
            }

            contact.setEmail(updated.getEmail());
            contact.setMobile(updated.getMobile());
            contact.setInstagram(updated.getInstagram());
            contact.setTwitter(updated.getTwitter());

            restaurant.setContactInformation(contact); // update reference (in case it was null)
        }

        return restaurantRepository.save(restaurant);
    }

    // Method to delete a restaurant by its ID
    @Transactional
    @Override
    public void deleteRestaurant(Long restaurantId) throws Exception {

        Restaurant restaurant = findRestaurantById(restaurantId);

        // Get all foods of this restaurant
        List<Food> restaurantFoods = restaurant.getFoods();

        // Delete cart items for each food
        for (Food food : restaurantFoods) {
            cartItemRepository.deleteByFood(food);
        }
        restaurantRepository.delete(restaurant);
    }

    // Method to retrieve all restaurants
//    @Override
//    public List<Restaurant> getAllRestaurants() throws Exception {
//        return restaurantRepository.findAll();
//    }

    @Override
    public List<RestaurantDto> getAllRestaurants() throws Exception {
        // Step 1: Get entities from repository
        List<Restaurant> restaurants = restaurantRepository.findAll();

        // Step 2: Convert entities to DTOs
        return restaurants.stream()
                .map(this::convertRestaurantToDto)
                .collect(Collectors.toList());
    }

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
        if(restaurant.getContactInformation() != null) {
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


    // Method to search for restaurants based on a keyword
    @Override
    public List<Restaurant> searchRestaurants(String keyword) throws Exception {
        return restaurantRepository.findBySearchQuery(keyword);
    }

    // Method to find a restaurant by its ID
    @Override
    public Restaurant findRestaurantById(Long Id) throws Exception {
        // Attempt to find restaurant by ID using repository
        Optional<Restaurant> opt = restaurantRepository.findById(Id);

        if(opt.isEmpty()){
            throw new Exception("Restaurant not found with id " + Id);
        }

        return opt.get();
    }

    // Method to get a restaurant based on the owner's user ID
    @Override
    public Restaurant getRestaurantByUserId(Long userId) throws Exception {
        Restaurant restaurant = restaurantRepository.findByOwnerId(userId);

        if(restaurant == null){
            throw new Exception("Restaurant not found with owner id " + userId);
        }

        return restaurant;
    }

    // Method to add or remove a restaurant from a user's favourites
//    @Override
//    public RestaurantDto addToFavourites(Long restaurantId, User user) throws Exception {
//
//        Restaurant restaurant = findRestaurantById(restaurantId);
//
//        RestaurantDto dto = new RestaurantDto();
//        dto.setDescription(restaurant.getDescription());
//        dto.setImages(restaurant.getImages());
//        dto.setName(restaurant.getName());
//        dto.setId(restaurantId);
//
//        // Check if restaurant is already a favourite and toggle
//        boolean isFavourite = false;
//        List<RestaurantDto> favourites = user.getFavourites();
//        for(RestaurantDto favourite : favourites){
//            if(favourite.getId().equals(restaurantId)){
//                isFavourite = true;
//                break;
//            }
//        }
//
//        // Add or remove from favourites based on current status
//        if(isFavourite){
//            favourites.removeIf(favourite -> favourite.getId().equals(restaurantId));
//        }else {
//            favourites.add(dto);
//        }
//
//        // Save the updated user with new favourites list
//        userRepository.save(user);
//
//        return dto;
//    }

    @Override
    public FavoriteRestaurant addToFavourites(Long restaurantId, User user) throws Exception {
        Restaurant restaurant = findRestaurantById(restaurantId);

        // Create favorite restaurant object
        FavoriteRestaurant favourite = new FavoriteRestaurant(
                restaurant.getId(),
                restaurant.getName(),
                restaurant.getImages(),
                restaurant.getDescription()
        );

        // First, remove ALL instances of this restaurant ID from favorites (handling duplicates)
        List<FavoriteRestaurant> updatedFavorites = new ArrayList<>();
        boolean hadExistingFavorite = false;

        for (FavoriteRestaurant existingFavorite : user.getFavourites()) {
            if (existingFavorite.getId().equals(restaurantId)) {
                hadExistingFavorite = true;
                // Skip this restaurant - don't add to updatedFavorites
            } else {
                // Keep all other restaurants
                updatedFavorites.add(existingFavorite);
            }
        }

        // Now handle the toggle logic
        if (!hadExistingFavorite) {
            // Add this restaurant if it wasn't already a favorite
            updatedFavorites.add(favourite);
        }

        // Replace the user's favorites list with our cleaned list
        user.setFavourites(updatedFavorites);
        userRepository.save(user);

        return favourite;
    }


    // Method to toggle the open status of a restaurant
    @Override
    public Restaurant updateRestaurantStatus(Long restaurantId) throws Exception {

        Restaurant restaurant = findRestaurantById(restaurantId);
        restaurant.setOpen(!restaurant.isOpen());

        return restaurantRepository.save(restaurant);
    }
}
