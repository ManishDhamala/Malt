package com.project.maltbackend.service;

import com.project.maltbackend.dto.FavoriteRestaurant;
import com.project.maltbackend.dto.RestaurantDto;
import com.project.maltbackend.model.Restaurant;
import com.project.maltbackend.model.User;
import com.project.maltbackend.request.CreateRestaurantRequest;

import java.util.List;

public interface RestaurantService {

    public Restaurant createRestaurant(CreateRestaurantRequest req, User user);

    public Restaurant updateRestaurant (Long restaurantId, CreateRestaurantRequest updatedRestaurant) throws Exception;

    public void deleteRestaurant (Long restaurantId) throws Exception;

    public List<RestaurantDto> getAllRestaurants() throws Exception;

   // public List<Restaurant> getAllRestaurants() throws Exception;

    public List<Restaurant> searchRestaurants(String keyword) throws Exception;

    public Restaurant findRestaurantById(Long Id) throws Exception;

    public Restaurant getRestaurantByUserId(Long userId) throws Exception;

   // public RestaurantDto addToFavourites(Long restaurantId, User user) throws Exception;

   public FavoriteRestaurant addToFavourites(Long restaurantId, User user) throws Exception;

    public Restaurant updateRestaurantStatus(Long restaurantId) throws Exception;



}
