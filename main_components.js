var eventBus= new Vue()

Vue.component('product',{
    props: {
        premium:{
            type: Boolean,
            required: true
        }
    },
    template: `                                         <!-- altgr+96 -->
    <div class="product">
        <div class="product-image">                         <!--* both of the product-type are defined in css stylesheet-->
            <img :src="image" alt="">                       <!--* v-bind directive before src in order to have a bond between the data and the attribute -->
        </div>
        <div class="product-info">
            <h1>{{title}}</h1> 
            <p v-if="inStock">In Stock</p>                                                                                                 <!--v-if with boolean value-->
            <!-- <p v-if="inventory > 10">In Stock</p>                                                                                     <!-- v-if and v-else-if in case we use inventory integer value -->
            <!-- <p v-else-if="inventory <= 10 && inventory > 0">Almost out of stock!</p> -->
            <p v-else>Out of Stock</p>
            <p>User is Premium: {{ premium }}</p>
            <p>Shipping: {{ shipping }}</p>

            <ul>
                <li v-for="detail in details">{{detail}}</li>                                                                               <!-- v-for in order to show every detail in out array-->
            </ul>

            <div v-for="(variant,index) in variants" :key="variant.variantId" class="color-box" 
                :style="{backgroundColor: variant.variantColor}" @mouseover="updateProduct(index)">                          <!-- variant.cariantColor can be added to a style, updateProduct(variant.variantImage) is a method -->
            </div>

            <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to Cart</button>                  <!-- v-on on the click event can also be written as @ before the event -->
        </div>

        <product-tabs :reviews="reviews"></product-tabs>

    </div>
    `,
    data() {
        return {
            brand: 'Vue Mastery',
            product: 'Socks',
            //image: 'img/vmSocks-green-onWhite.jpg',           due to refactor as computed
            selectedVariant: 0,
            //inStock: true,                                    removed for refector and make it as a computed
            //inventory: 100
            details:['80% cotton','20% polyester','Gender-neutral'],
            variants: [
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
            reviews: []
        }
    } ,        
    methods: {
        addToCart(){
            //this.cart++                     //this .cart is no longer on our component
            this.$emit('add-to-cart',this.variants[this.selectedVariant].variantId)
        },
        updateProduct(index){            //using variantImage as method and index as computed
            this.selectedVariant=index      //instead update this.image i can update this.selectedVariant      
        }
        // addReview(productReview){
        //     this.reviews.push(productReview)             not using this anymore because of eventBus
        // }
    },
    computed : {
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
    mounted(){                               //lifecicle hook
        eventBus.$on('review-submitted', productReview =>{
            this.reviews.push(productReview)
        })
    }
})

Vue.component('product-review',{
    template:`
        <form class="review-form" @submit.prevent="onSubmit">

            <p v-if="errors.length">
                <b>Please check the errors: </b>
                <ul>
                    <li v-for="error in errors">
                        {{error}}
                    </li>
                </ul>
            </p>

            <p>
                <label for="name">Name:</label>
                <input id="name" v-model="name" placeholder="Your Name Here">
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
          </form>
    `,
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
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: this.rating
                }
                eventBus.$emit('review-submitted', productReview)
                this.name = null
                this.review = null
                this.rating = null
            } else {
                if (!this.name) this.errors.push('Insert your Name, please.')
                if (!this.rating) this.errors.push('Insert your Rating, please.')
                if (!this.review) this.errors.push('Insert your Review, please.')
            }
        }
    }
})

Vue.component('product-tabs',{
    props: {                                //attribute that you can register to a component
        reviews: {
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
                <li v-for="review in reviews">
                    <p>{{ review.name }}</p>
                    <p>Rating: {{ review.rating }}</p>
                    <p>{{ review.review }}</p>
                </li>
            </ul>
        </div>

        <product-review v-show="selectedTab === 'Make a Review'"></product-review>

        </div>
    `,
    data() {
        return {
            tabs:['Reviews', 'Make a Review'],
            selectedTab: 'Reviews'
        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []                                            // array initialization              
    },
    methods: {
        updateCart(id){
            this.cart.push(id)
        }
    }
})