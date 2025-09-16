# DATABASE

## Features (đặc trưng)

### Admin panel

- Managers management (admins)
- Categories management
- Products management
- Coupons management
- Users management
- Order management

### Customer

- Homepage (all products pagination, categories list)
- Category detail
- Product detail
- Cart
- Payment
- Order status

## DB design

### Admins (manager)

```yaml
- email: string
- name: string
- isActive: boolean
- deleted_at: string
- created_at: string
- updated_at: string
```

### Categories

```yaml
- name: string
- slug: string
- description: string // html
- images: string[] // url to storage firebase
- deleted_at: string
- created_at: string
- updated_at: string
```

### Products

```yaml
- name: string
- slug: string
- description: string // html
- images: string[] // url to storage firebase
- categories: Array<CategoriesRef>
    | ### Categories
        - id: string
        - name: string
        - slug: string
        - description: string // html
- properties: 
    | ### properties
        - name: string
        - color: string
        - size: string
        - price: string
```

### Coupons

```yaml
- name: string
- code: string 
- expired_at: string
- percent: number(%)
- stripe_id: string
```

### Users

```yaml
- email: string 
- google_id: string
- facebook: string
- firstname: string
- lastname: string
- avata: string // url to storage firebase
```

### Cart

```yaml
- user: UserRef
- products: Array<ProductRef>
```

### Orders

```yaml
- user: UserRef
- products: Array<ProductRef>
- coupon: CouponRef 
- total: number
- strige_invoice_id: string
- status: string
```
