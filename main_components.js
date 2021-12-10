Vue.component('product-review',{
    template:`
        <input v-model="name">
    `,
    data(){
        return {
            name: null
        }
    }
})


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
            ]            
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