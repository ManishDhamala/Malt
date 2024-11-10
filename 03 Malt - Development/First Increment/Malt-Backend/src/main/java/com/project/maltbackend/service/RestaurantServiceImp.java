package com.project.maltbackend.service;

import com.project.maltbackend.dto.RestaurantDto;
import com.project.maltbackend.model.Address;
import com.project.maltbackend.model.Restaurant;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.AddressRepository;
import com.project.maltbackend.repository.RestaurantRepository;
import com.project.maltbackend.repository.UserRepository;
import com.project.maltbackend.request.CreateRestaurantRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RestaurantServiceImp implements RestaurantService{

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private UserRepository userRepository;

    // Method to create a new restaurant based on the request data and the user
    @Override
    public Restaurant createRestaurant(CreateRestaurantRequest req, User user) {
        Address address = addressRepository.save(req.getAddress());

        Restaurant restaurant = new Restaurant();
        restaurant.setAddress(address);
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
        if(restaurant.getDescription() != null){
            restaurant.setDescription(updatedRestaurant.getDescription());
        }

        if(restaurant.getName() != null){
            restaurant.setName(updatedRestaurant.getName());
        }

        return restaurantRepository.save(restaurant);
    }

    // Method to delete a restaurant by its ID
    @Override
    public void deleteRestaurant(Long restaurantId) throws Exception {

        Restaurant restaurant = findRestaurantById(restaurantId);
        restaurantRepository.delete(restaurant);

    }

    // Method to retrieve all restaurants
    @Override
    public List<Restaurant> getAllRestaurants() throws Exception {
        return restaurantRepository.findAll();
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
    @Override
    public RestaurantDto addToFavourites(Long restaurantId, User user) throws Exception {

        Restaurant restaurant = findRestaurantById(restaurantId);

        RestaurantDto dto = new RestaurantDto();
        dto.setDescription(restaurant.getDescription());
        dto.setImages(restaurant.getImages());
        dto.setTitle(restaurant.getName());
        dto.setId(restaurantId);

        // Check if restaurant is already a favourite and toggle
        boolean isFavourite = false;
        List<RestaurantDto> favourites = user.getFavourites();
        for(RestaurantDto favourite : favourites){
            if(favourite.getId().equals(restaurantId)){
                isFavourite = true;
                break;
            }
        }

        // Add or remove from favourites based on current status
        if(isFavourite){
            favourites.removeIf(favourite -> favourite.getId().equals(restaurantId));
        }else {
            favourites.add(dto);
        }

        // Save the updated user with new favourites list
        userRepository.save(user);

        return dto;
    }

    // Method to toggle the open status of a restaurant
    @Override
    public Restaurant updateRestaurantStatus(Long restaurantId) throws Exception {

        Restaurant restaurant = findRestaurantById(restaurantId);
        restaurant.setOpen(!restaurant.isOpen());

        return restaurantRepository.save(restaurant);
    }
}
