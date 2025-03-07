package com.project.maltbackend.service;

import com.project.maltbackend.model.Cart;
import com.project.maltbackend.model.CartItem;
import com.project.maltbackend.model.Food;
import com.project.maltbackend.model.User;
import com.project.maltbackend.repository.CartItemRepository;
import com.project.maltbackend.repository.CartRepository;
import com.project.maltbackend.repository.FoodRepository;
import com.project.maltbackend.request.AddCartItemRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartServiceImp implements CartService {


    private final CartRepository cartRepository;
    private final UserService userService;
    private final CartItemRepository cartItemRepository;

    private final FoodService foodService;

    @Override
    public CartItem addItemToCart(AddCartItemRequest request, String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);
        Food food = foodService.findFoodById(request.getFoodId());

        // Ensure cart exists or create a new one
        Cart cart = cartRepository.findByCustomerId(user.getId());
        if (cart == null) {
            cart = new Cart();
            cart.setCustomer(user);
            cart.setTotal(0L);
            cart = cartRepository.save(cart); // Save newly created cart
        }

        // Explicitly fetch cart items
        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        for (CartItem cartItem : cartItems) {
            if (cartItem.getFood().getId().equals(food.getId())) { // Compare IDs to prevent duplication
                int newQuantity = cartItem.getQuantity() + request.getQuantity();

                // Enforce max quantity limit
                if (newQuantity > 25) {
                    throw new Exception("Maximum quantity limit (25) exceeded for this item.");
                }

                cartItem.setQuantity(newQuantity);
                cartItem.setTotalPrice(cartItem.getFood().getPrice() * newQuantity);

                CartItem updatedCartItem = cartItemRepository.save(cartItem); // Save updated item
                return updatedCartItem;
            }
        }

        // If item does not exist in the cart, add a new entry
        if (request.getQuantity() > 25) {
            throw new Exception("Maximum quantity limit (25) exceeded for this item.");
        }

        CartItem newCartItem = new CartItem();
        newCartItem.setFood(food);
        newCartItem.setCart(cart);
        newCartItem.setQuantity(request.getQuantity());
        newCartItem.setTotalPrice(request.getQuantity() * food.getPrice());

        CartItem savedCartItem = cartItemRepository.save(newCartItem);

        // Update cart's item list properly
        cart.getItems().add(savedCartItem);
        cartRepository.save(cart); // Save cart with updated items

        return savedCartItem;
    }


    @Override
    public CartItem updateCartItemQuantity(Long cartItemId, int quantity) throws Exception {

        Optional<CartItem> cartItemOptional = cartItemRepository.findById(cartItemId);

        if(cartItemOptional.isEmpty()){
            throw new Exception("Cart item not found");
        }

        //Check limit for updated cart item +
        if(quantity>25){
            throw new Exception("Maximum quantity limit (25) exceeds for this item.");
        }

        CartItem item = cartItemOptional.get();
        item.setQuantity(quantity);
        item.setTotalPrice(item.getFood().getPrice() * quantity);


        return cartItemRepository.save(item);
    }

    @Override
    public Cart removeItemFromCart(Long cartItemId, String jwt) throws Exception {
        User user = userService.findUserByJwtToken(jwt);

        Cart cart = cartRepository.findByCustomerId(user.getId());

        Optional<CartItem> cartItemOptional = cartItemRepository.findById(cartItemId);

        if(cartItemOptional.isEmpty()){
            throw new Exception("Cart item not found");
        }

        CartItem item = cartItemOptional.get();

        cart.getItems().remove(item);

        return cartRepository.save(cart);
    }

    @Override
    public Long calculateCartTotals(Cart cart) throws Exception {
        Long total = 0L;

        for(CartItem cartItem : cart.getItems()){
            total += cartItem.getFood().getPrice() * cartItem.getQuantity();
        }
        return total;
    }

    @Override
    public Cart findCartById(Long id) throws Exception {
        Optional<Cart> optionalCart = cartRepository.findById(id);
        if(optionalCart.isEmpty()){
            throw new Exception("Cart not found with id: "+id);
        }
        return optionalCart.get();
    }

    @Override
    public Cart findCartByUserId(Long userId) throws Exception {

       // User user = userService.findUserByJwtToken(jwt);

        Cart cart = cartRepository.findByCustomerId(userId);
        cart.setTotal(calculateCartTotals(cart));
        return cart;
    }

    @Override
    public Cart clearCart(Long userId) throws Exception {
       // User user = userService.findUserByJwtToken(jwt);  // check this

        Cart cart = findCartByUserId(userId);
        cart.getItems().clear();
        return cartRepository.save(cart);
    }


}
