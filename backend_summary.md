# Backend Analysis Summary

## 1. Project Overview
- **Framework**: Spring Boot 3 (referenced as `4.0.0` parent in pom, but likely 3.x based on `jakarta.*` imports) with Java 17.
- **Database**: MySQL (using `mysql-connector-j`).
- **ORM**: Hibernate/JPA (`spring-boot-starter-data-jpa`).
- **Security**: Spring Security + JWT (`jjwt`).
- **Documentation**: OpenAPI/Swagger (`springdoc-openapi-starter-webmvc-ui`).

## 2. Source Code Structure
The main application code is located in `src/main/java/tn/carparts/carparts`.

### Key Packages
- **`config`**: Security and application configuration (e.g., JWT filters, SecurityFilterChain).
- **`controller`**: REST API endpoints.
- **`DTO`**: Data Transfer Objects for API requests/responses.
- **`entity`**: Database models (JPA Entities).
- **`enums`**: Enumerations (e.g., `Role`, `OrderStatus`).
- **`mapper`**: Utilities to map between Entities and DTOs.
- **`repository`**: Data access interfaces (extending `JpaRepository`).
- **`service`**: Business logic layer.

## 3. Data Model & Relationships (The Joins)
This section describes the links between different entities.

### **Car Hierarchy**
1.  **`CarBrand`** (e.g., Toyota)
    *   **1:N** -> `CarModel` (One brand has many models).
2.  **`CarModel`** (e.g., Corolla)
    *   **N:1** -> `CarBrand` (Belongs to one brand).
    *   **1:N** -> `CarGeneration` (One model has many generations).
3.  **`CarGeneration`** (e.g., E120)
    *   **N:1** -> `CarModel` (Belongs to one model).
    *   **N:M** -> `CarPart` (Many parts are compatible with many generations).
        *   *Relationship hosted by `CarPart` via `part_compatibility` join table.*

### **Part Categorization**
1.  **`Category`** (e.g., Engine)
    *   **1:N** -> `SubCategory` (One category has many subcategories).
2.  **`SubCategory`** (e.g., Pistons)
    *   **N:1** -> `Category` (Belongs to one category).
    *   **1:N** -> `CarPart` (One subcategory contains many parts).
3.  **`Designation`** (e.g., Front Left Brake Pad)
    *   **1:N** -> `CarPart` (One designation can be used for multiple parts).

### **Car Parts**
*   **`CarPart`**: The central entity.
    *   **N:M** -> `CarGeneration` (Compatibility).
    *   **N:1** -> `SubCategory` (Classification).
    *   **N:1** -> `Designation` (Naming/Type).

### **Users & Orders**
1.  **`User`**
    *   Stores `username`, `email`, `password`, `role` (USER/ADMIN), `phone`, `whatsapp`.
    *   Uses `PasswordResetToken` for recovery.
2.  **`CarPartOrder`**
    *   **N:1** -> `User` (One user places many orders).
    *   **1:N** -> `CarPartOrderItem` (One order contains many items).
3.  **`CarPartOrderItem`**
    *   **N:1** -> `CarPartOrder` (Belongs to an order).
    *   **N:1** -> `CarPart` (Refers to a specific part). *Note: Has `OnDeleteAction.SET_NULL` to preserve order history if a part is deleted.*

## 4. API Architecture (Controllers)
The API is divided into Admin, Public, and User sections.

### **Public API (Unsecured/Open)**
*   `PublicCarController`: Retrieve brands, models, and generations.
*   `PublicCategoryController`: Retrieve categories and subcategories.

### **Admin API (Secured, likely requires ADMIN role)**
*   `AdminCarController`: CRUD for brands, models, generations.
*   `AdminCategoryController`: CRUD for categories, subcategories.
*   `CarPartController`: Manage parts inventory (Add, Update, Delete).
*   `DesignationController`: Manage part designations.
*   `UserController`: Manage users (likely listing, banning, etc.).

### **User/Order API (Secured)**
*   `CarPartOrderController`: Place orders, view order history.
*   `UserController`: User profile management.

## 5. Key Business Logic (Services)
*   `CarPartService`: Handles complex logic for parts, including calculating sale prices (`calculateSalePrice()`), stock management, and compatibility mapping.
*   `CarPartOrderService`: Manages order lifecycle (`PENDING`, `CONFIRMED`, etc.) and processing.
*   `UserService`: Handles authentication, registration, and profile updates.
*   `FileUploadService`: Handles image uploads for parts, categories, brands, etc.
