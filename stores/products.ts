import { defineStore } from "pinia";
import { useApi } from "../composables/useApi";

export interface Product {
    id: number;
    name: string;
    title: string;
    description: string;
    price: number;
    image: string;
    image_url: string;
    category_id: number;
    category_name: string;
    is_available: boolean;
    sizes?: ProductSize[];
    variants?: ProductVariant[];
    liked?: boolean;
}

export interface ProductSize {
    id: number;
    name: string;
    price: number;
    value: string;
}

export interface ProductVariant {
    id: number;
    name: string;
    price: number;
    image?: string;
}

export interface ProductCategory {
    id: number;
    name: string;
    image: string;
    products_count: number;
}

export interface ProductsResponse {
    products: Product[];
    categories: ProductCategory[];
    pagination?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export const useProducts = defineStore("products", {
    state: () => {
        return {
            isLoading: false,
            error: null as string | null,
            products: [] as Product[],
            categories: [] as ProductCategory[],
            selectedCategory: null as number | null,
            searchQuery: '',
            pagination: null as any,
            popularProducts: [] as Product[],
            newProducts: [] as Product[],
            sliders: [] as any[],
        }
    },

    getters: {
        // Get filtered products based on category and search
        filteredProducts(state): Product[] {
            // Ensure products is an array
            const productsArray = Array.isArray(state.products) ? state.products : [];
            let filtered = productsArray;

            // Filter by category
            if (state.selectedCategory) {
                filtered = filtered.filter(product => product.category_id === state.selectedCategory);
            }

            // Filter by search query
            if (state.searchQuery) {
                const query = state.searchQuery.toLowerCase();
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.title.toLowerCase().includes(query) ||
                    product.description.toLowerCase().includes(query)
                );
            }

            return filtered;
        },

        // Get available products only
        availableProducts(state): Product[] {
            // Ensure products is an array
            const productsArray = Array.isArray(state.products) ? state.products : [];
            return productsArray.filter(product => product.is_available);
        },

        // Transform products for UI compatibility
        transformedProducts(state): any[] {
            // Ensure products is an array
            const productsArray = Array.isArray(state.products) ? state.products : [];
            return productsArray.map(product => ({
                id: product.id,
                title: product.title || product.name,
                name: product.name,
                price: `${product.price} ${product.currency || 'SAR'}`,
                original_price: product.original_price,
                price_before_discount: product.price_before_discount,
                discount: product.discount,
                image_url: product.image_url || product.image || '/assets/img/default-product.png',
                image: product.image,
                feature_image: product.feature_image,
                product_cart_image: product.product_cart_image,
                liked: product.liked || false,
                category_id: product.category_id,
                category_name: product.category_name,
                description: product.description,
                is_available: product.is_available,
                is_active: product.is_active,
                out_of_stock: product.out_of_stock,
                currency: product.currency,
                min_order_qty: product.min_order_qty,
                has_modifiers: product.has_modifiers,
                service_fees: product.service_fees || [],
                sizes: product.sizes || [],
                variants: product.variants || []
            }));
        },

        // Get popular products (first 6 products or marked as popular)
        getPopularProducts(state): any[] {
            // Ensure products is an array before using slice
            const productsArray = Array.isArray(state.products) ? state.products : [];
            const popularArray = Array.isArray(state.popularProducts) ? state.popularProducts : [];

            const popular = popularArray.length > 0 ? popularArray : productsArray.slice(0, 6);

            if (!Array.isArray(popular)) {
                return [];
            }

            return popular.map(product => ({
                id: product.id,
                title: product.title || product.name,
                price: `${product.price} ${product.currency || 'SAR'}`,
                image_url: product.image_url || product.image || '/assets/img/default-product.png',
                liked: product.liked || false,
                original_price: product.original_price,
                discount: product.discount,
                is_available: product.is_available
            }));
        },

        // Get new arrival products (last 6 products or marked as new)
        getNewProducts(state): any[] {
            // Ensure products is an array before using slice
            const productsArray = Array.isArray(state.products) ? state.products : [];
            const newProductsArray = Array.isArray(state.newProducts) ? state.newProducts : [];

            const newProducts = newProductsArray.length > 0 ? newProductsArray : productsArray.slice(-6);

            if (!Array.isArray(newProducts)) {
                return [];
            }

            return newProducts.map(product => ({
                id: product.id,
                title: product.title || product.name,
                price: `${product.price} ${product.currency || 'SAR'}`,
                image_url: product.image_url || product.image || '/assets/img/default-product.png',
                liked: product.liked || false,
                original_price: product.original_price,
                discount: product.discount,
                is_available: product.is_available
            }));
        }
    },

    actions: {
        async fetchProducts(params: any = {}) {
            this.$state.isLoading = true;
            this.$state.error = null;

            try {
                console.log('Fetching shop products from API with params:', params);

                // Build the API parameters
                const apiParams: any = {
                    // Include filter parameters from the component
                    branch_id: params.branch_id,
                    menu_id: params.menu_id,
                    sub_category_id: params.sub_category_id,
                    order_method: params.order_method,
                    // Include existing store filters
                    category_id: this.selectedCategory,
                    search: this.searchQuery,
                };

                // Remove null/undefined values
                Object.keys(apiParams).forEach(key => {
                    if (apiParams[key] === null || apiParams[key] === undefined) {
                        delete apiParams[key];
                    }
                });

                console.log('Final API parameters:', apiParams);

                // Build URL with query parameters
                const queryString = new URLSearchParams(
                    Object.entries(apiParams).map(([key, value]) => [key, String(value)])
                ).toString();

                const endpoint = queryString ? `products?${queryString}` : 'products';
                console.log('API endpoint with query:', endpoint);

                const { data: response, error } = await useApi(endpoint, {
                    method: 'GET'
                });

                console.log('Products API response:', response);
                console.log('Response error:', error);

                if (error.value) {
                    throw new Error(error.value?.message || 'Failed to fetch products');
                }

                const apiData = response.value;
                console.log('API data:', apiData);
                console.log('API data status:', apiData?.status);
                console.log('API data products:', apiData?.data?.products);

                if (apiData?.status) {
                    const data = apiData.data;
                    console.log('Processing response data:', data);

                    // Handle the actual API response structure
                    let products = data.products || [];
                    console.log('Extracted products array:', products);
                    console.log('Products array length:', products.length);
                    console.log('Is products array?', Array.isArray(products));

                    if (!Array.isArray(products)) {
                        console.log('Products is not an array, setting to empty array');
                        products = [];
                    }

                    console.log('About to transform products...');
                    // Transform API products to match our UI expectations
                    this.$state.products = products.map((product: any) => {
                        console.log('Transforming product:', product.id, product.name);
                        return {
                            id: product.id,
                            name: product.name,
                            title: product.name, // Use name as title
                            description: product.description || product.brief_description || '',
                            price: product.price,
                            original_price: product.original_price,
                            price_before_discount: product.price_before_discount,
                            discount: product.discount,
                            image: product.image,
                            image_url: product.image || product.feature_image || product.product_cart_image,
                            inner_image: product.inner_image,
                            feature_image: product.feature_image,
                            product_cart_image: product.product_cart_image,
                            currency: product.currency || 'SAR',
                            is_available: product.is_active && !product.out_of_stock,
                            is_active: product.is_active,
                            out_of_stock: product.out_of_stock,
                            is_feature: product.is_feature,
                            has_modifiers: product.has_modifiers,
                            min_order_qty: product.min_order_qty || 1,
                            categories: product.categories,
                            service_fees: product.service_fees || [],
                            liked: false // Default to not liked
                        };
                    });

                    this.$state.categories = Array.isArray(data.categories) ? data.categories : [];
                    this.$state.pagination = data.pagination_options || data.pagination || null;

                    console.log('Products loaded and transformed:', this.$state.products.length);
                    console.log('Final products state:', this.$state.products);
                    console.log('Final pagination state:', this.$state.pagination);
                    return { success: true, data: apiData.data };
                } else {
                    throw new Error(apiData?.message || 'Failed to fetch products');
                }
            } catch (error: any) {
                console.error('Error fetching products:', error);
                this.$state.error = error?.message || 'Failed to fetch products';

                // Add fallback retail products for testing
                this.$state.products = [
                    {
                        id: 101,
                        name: 'Premium Hair Oil',
                        title: 'Argan Hair Oil',
                        description: 'Nourishing argan oil for healthy, shiny hair',
                        price: 150,
                        image: '/assets/img/product-1.svg',
                        image_url: '/assets/img/product-1.svg',
                        category_id: 1,
                        category_name: 'Hair Products',
                        is_available: true,
                        liked: false
                    },
                    {
                        id: 102,
                        name: 'Luxury Face Cream',
                        title: 'Anti-Aging Face Cream',
                        description: 'Premium anti-aging cream with natural ingredients',
                        price: 280,
                        image: '/assets/img/product-2.svg',
                        image_url: '/assets/img/product-2.svg',
                        category_id: 2,
                        category_name: 'Skincare',
                        is_available: true,
                        liked: true
                    },
                    {
                        id: 103,
                        name: 'Organic Shampoo',
                        title: 'Sulfate-Free Shampoo',
                        description: 'Gentle organic shampoo for all hair types',
                        price: 120,
                        image: '/assets/img/product-1.svg',
                        image_url: '/assets/img/product-1.svg',
                        category_id: 1,
                        category_name: 'Hair Products',
                        is_available: true,
                        liked: false
                    },
                    {
                        id: 104,
                        name: 'Body Butter',
                        title: 'Shea Body Butter',
                        description: 'Rich moisturizing body butter with shea',
                        price: 95,
                        image: '/assets/img/product-2.svg',
                        image_url: '/assets/img/product-2.svg',
                        category_id: 3,
                        category_name: 'Body Care',
                        is_available: true,
                        liked: false
                    },
                    {
                        id: 105,
                        name: 'Vitamin C Serum',
                        title: 'Brightening Serum',
                        description: 'Vitamin C serum for radiant skin',
                        price: 220,
                        image: '/assets/img/product-1.svg',
                        image_url: '/assets/img/product-1.svg',
                        category_id: 2,
                        category_name: 'Skincare',
                        is_available: true,
                        liked: true
                    },
                    {
                        id: 106,
                        name: 'Hair Mask',
                        title: 'Deep Conditioning Mask',
                        description: 'Intensive hair treatment mask',
                        price: 180,
                        image: '/assets/img/product-2.svg',
                        image_url: '/assets/img/product-2.svg',
                        category_id: 1,
                        category_name: 'Hair Products',
                        is_available: true,
                        liked: false
                    }
                ];

                console.log('Using fallback products:', this.$state.products.length);
                return { success: false, error: this.$state.error };
            } finally {
                this.$state.isLoading = false;
            }
        },

        async fetchProductById(id: number) {
            try {
                const { data: response, error } = await useApi(`products/${id}`, {
                    method: 'GET'
                });

                if (error.value) {
                    throw new Error(error.value?.message || 'Failed to fetch product');
                }

                const apiData = response.value;
                if (apiData?.status) {
                    return { success: true, data: apiData.data };
                } else {
                    throw new Error(apiData?.message || 'Failed to fetch product');
                }
            } catch (error: any) {
                console.error('Error fetching product:', error);
                return { success: false, error: error?.message || 'Failed to fetch product' };
            }
        },

        initializeSliders() {
            // Set static sliders - no API call needed
            this.$state.sliders = [
                {
                    id: 1,
                    title: 'First Timer Sale',
                    image_url: '/assets/img/shop-slide.svg',
                    sub_title: '60% OFF FIRST BOOKING',
                    clickable: true,
                    url: '/services'
                },
                {
                    id: 2,
                    title: 'Premium Services',
                    image_url: '/assets/img/spa.svg',
                    sub_title: 'Discover our luxury treatments',
                    clickable: true,
                    url: '/services'
                },
                {
                    id: 3,
                    title: 'Shop Products',
                    image_url: '/assets/img/shop-slide.svg',
                    sub_title: 'Browse our premium products',
                    clickable: true,
                    url: '/shop'
                }
            ];

            console.log('Static sliders initialized:', this.$state.sliders.length);
            return { success: true, data: this.$state.sliders };
        },

        setSelectedCategory(categoryId: number | null) {
            this.$state.selectedCategory = categoryId;
        },

        setSearchQuery(query: string) {
            this.$state.searchQuery = query;
        },

        toggleProductLike(productId: number) {
            // Ensure products is an array
            if (Array.isArray(this.$state.products)) {
                const product = this.$state.products.find(p => p.id === productId);
                if (product) {
                    product.liked = !product.liked;
                }
            }
        },

        clearError() {
            this.$state.error = null;
        },

        clearProducts() {
            this.$state.products = [];
            this.$state.categories = [];
            this.$state.pagination = null;
            this.$state.error = null;
        },

        async initializeShop() {
            this.$state.isLoading = true;

            try {
                // Fetch products from API and initialize static sliders
                const [productsResult, slidersResult] = await Promise.all([
                    this.fetchProducts(),
                    Promise.resolve(this.initializeSliders()) // No async needed for static data
                ]);

                if (productsResult.success && slidersResult.success) {
                    return { success: true };
                } else {
                    throw new Error('Failed to initialize shop data');
                }
            } catch (error: any) {
                console.error('Error initializing shop:', error);
                this.$state.error = error?.message || 'Failed to initialize shop';
                return { success: false, error: this.$state.error };
            } finally {
                this.$state.isLoading = false;
            }
        }
    },

    persist: {
        storage: localStorage,
        paths: ['products', 'categories', 'sliders']
    }
});
