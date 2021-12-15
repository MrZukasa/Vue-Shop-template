var eventBus= new Vue()                     //* global event listener which is used as "eventBus.$on('custom-event',() => {})"

Vue.component('product',{                       //* delcaration of a new Vue.component named "product"
    props: {
        premium:{                               //* declaration of a 'props' named "premium" which is a Boolean type and is required
            type: Boolean,
            required: true
        }
    },
    template: `                      <!-- starting the Template of the component which include a lot of html that will be displayed -->
        <div class="product">
            <div class="product-image">                         <!-- class is for CSS style -->
                <img :src="image" alt="">                       <!--* v-bind directive before src in order to have a bond between the data and the attribute -->
            </div>
            <div class="product-info">                          <!-- class is for CSS style -->
                <h1>{{title}}</h1> 
                <p v-if="inStock">In Stock</p>                                                          <!--v-if with boolean value-->
                <!-- <p v-if="inventory > 10">In Stock</p>                                              <!--v-if with numeric value-->
                <!-- <p v-else-if="inventory <= 10 && inventory > 0">Almost out of stock!</p> -->
                <p v-else>Out of Stock</p>
                <p>User is Premium: {{ premium }}</p>                   <!-- check if user is premium with props -->
                <p>Shipping: {{ shipping }}</p>                         <!-- computed to check if shipment is free or not -->

                <ul>
                    <li v-for="detail in details">{{detail}}</li>                                                                <!-- v-for in order to show every detail in out array-->
                </ul>

                <div v-for="(variant,index) in variants" :key="variant.variantId" class="color-box" 
                    :style="{backgroundColor: variant.variantColor}" @mouseover="updateProduct(index)">                          <!-- variant.variantColor can be added to a style, updateProduct(index) is a method -->
                </div>

                <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to Cart</button>       <!-- method "addToCart", disabled if inStock is false even in style -->
            </div>

            <product-tabs :reviews="reviews"></product-tabs>                                                                     <!-- new component "product-tabs" with v-bind on "reviews" method which is required -->

        </div>`,

    data() {                                                //! data section of the component
        return {
            brand: 'Vue Mastery',                           
            product: 'Socks',
            //image: 'img/vmSocks-green-onWhite.jpg',           due to refactor as computed
            selectedVariant: 0,
            //inStock: true,                                    removed for refector and make it as a computed
            //inventory: 100
            details:['80% cotton','20% polyester','Gender-neutral'],                    //* array declaration
            variants: [                                                                 //* structured type of element
                {
                    variantId: '2234',
                    variantColor: 'green',
                    variantImage : 'img/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10
                },
                {
                    variantId: '2235',
                    variantColor: 'blue',
                    variantImage : 'img/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 0
                }
            ],
            reviews: []                                                                 //* reviews's array
        }
    },
    methods: {                                              //! method section of the component
        addToCart(){
            //this.cart++                                                                       //this .cart is no longer on our component
            this.$emit('add-to-cart',this.variants[this.selectedVariant].variantId)             //* emitter of the 'add-to-cart' event with selected id of our product
        },                                                                                      //* that is used in our HTML page along a call to "updateCart" method but the ID parameter was passed directly into the event emitter
        updateProduct(index){
            this.selectedVariant=index                                                          //* update the selectedVariant in order to have the selected product highlighted
        }
        // addReview(productReview){
        //     this.reviews.push(productReview)             not using this anymore because of eventBus
        // }
    },
    computed : {                                                                                //* computed property will only re-evaluate when some of its reactive dependencies have changed
        title(){
            return this.brand + ' ' + this.product
        },
        image(){
            return this.variants[this.selectedVariant].variantImage
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },
        shipping(){
            if (this.premium) {
                return "Free"
            } else {
                return 2.99
            }
        }
    },
    mounted(){                                                                                 //* lifecicle hook
        eventBus.$on('review-submitted', productReview =>{                                     //* event listener which is currently listening to 'review-submitted' event with a callback parameter
            this.reviews.push(productReview)                                                   //* adding the review to the reviews's array
        })
    }
})

Vue.component('product-review',{                                                               //* new component called product-review
    template:`
        <form class="review-form" @submit.prevent="onSubmit">                                  //* 'v-on' submit event with prevent parameter that avoid page to reload also call the method onSubmit

            <p v-if="errors.length">                                                           //* if there is an error, show error <p>
                <b>Please check the errors: </b>
                <ul>
                    <li v-for="error in errors">                                               //* cycle for print error
                        {{error}}
                    </li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="Your Name Here">                   //* v-model used to take input
            </p>
 
            <p>
                <label for="review">Review:</label>
                <textarea id="review" v-model="review" placeholder="Your Review Here"></textarea>
            </p>
    
            <p>
                <label for="rating">Rating:</label>
                <select id="rating" v-model.number="rating">
                    <option>5</option>
                    <option>4</option>
                    <option>3</option>
                    <option>2</option>
                    <option>1</option>
                </select>
            </p>
        
            <p>
                <input type="submit" value="Submit">
            </p>
        </form>`,
    data(){
        return {
            name: null,
            review: null,
            rating: null,
            errors: []
        }
    },
    methods: {
        onSubmit() {
            if (this.name && this.review && this.rating){
                let productReview = {                                                           //* populate an object that contain every field that we need
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)                               //* emit the 'review-submitted' event with the "productReview" object as parameter
                this.name = null                                                                //* initialize the fields after usage
                this.review = null
                this.rating = null
            } else {
                if (!this.name) this.errors.push('Insert your Name, please.')                   //* if the field are empty then push the correct error
                if (!this.rating) this.errors.push('Insert your Rating, please.')
                if (!this.review) this.errors.push('Insert your Review, please.')
            }
        }
    }
})

Vue.component('product-tabs',{
    props: {                                                                                    //* attribute that you can register to a component
        reviews: {                                                                              //* make an array of reviews
            type: Array,
            required: true
        }
    },
    template: `
        <div>
            <span class="tab" :class="{ activeTab: selectedTab === tab }" v-for="(tab,index) in tabs" :key="index" @click="selectedTab=tab">
                {{tab}}
            </span>
            
        <div v-show="selectedTab === 'Reviews'">
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet for this product.</p>
            <ul>
                <li v-for="review in reviews">                                                  //* v-for that allow to see all the reviews
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>

        <product-review v-show="selectedTab === 'Make a Review'"></product-review>              //* other component 

        </div>`,
    data() {
        return {
            tabs:['Reviews', 'Make a Review'],                                                  //* creating a tab array which contains the two tab label
            selectedTab: 'Reviews'                                                              //* the selectedTab is a string
        }
    }
})

var app = new Vue({                                                                             //* main app which contain the premium feature and the cart
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id){                                                                         //* this method allow to push the id into the cart
            this.cart.push(id)
        }
    }
})