var app = new Vue({
    el: '#app',
    data: {
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
        cart: 0
    },
    methods: {
        addToCart(){
            this.cart++
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
        }
    }
})