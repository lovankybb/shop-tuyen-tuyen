# Role Refactoring Summary
## Overview
Successfully refactored the application to change role management from String-based to Entity-based (Role entity), and created an AppInitializer for automatic initialization of permissions, roles, and admin account.
## Changes Made
### 1. Entity Layer (No Changes Required)
- **User.java**: Already has `Set<Role> roles` mapped correctly
- **Role.java**: Already has permissions mapping
- **Permission.java**: No changes needed
### 2. Repository Layer (No Changes Required)
- **RoleRepository**: Already has `findByName(String name)` method
- **PermissionRepository**: Already has `findByName(String name)` method
- **UserRepository**: No changes needed
### 3. DTO Request Layer - Updated
#### UserRoleUpdateRequest.java
- **Before**: `String role` (single role)
- **After**: `Set<String> roleNames` (support multiple roles)
- Now allows assigning multiple roles to users
### 4. DTO Response Layer - Updated
#### UserResponse.java
- **Before**: `String role`
- **After**: `Set<RoleResponse> roles`
- Now returns complete role information including permissions
### 5. Service Layer - Updated
#### UserService.java
- **Added imports**: 
  - `Role`, `RoleResponse` entities
  - `RoleRepository`, `RoleMapper` dependencies
- **createUser()**: Now fetches USER role from repository and assigns it as default role
- **getMyProfile()**: Returns Set<RoleResponse> instead of single role string
- **updateMyProfile()**: Returns Set<RoleResponse> instead of single role string
- **getAllUsers()**: Returns Set<RoleResponse> for each user instead of single role string
- **updateUserRole()**: 
  - Changed signature: `updateUserRole(Long id, UserRoleUpdateRequest request)`
  - Now fetches Role entities from repository using role names
  - Supports assigning multiple roles to a user
  - Returns Set<RoleResponse> with complete role information
#### AuthenticationService.java
- **generateToken()**: Updated to handle Set<Role>
  - Converts all user roles to JWT scope claim
  - Formats as "SCOPE_ROLENAME" for each role
  - Multiple roles are space-separated in JWT claims
### 6. Controller Layer - Updated
#### UserController.java
- **updateUserRole()**: Updated to accept new UserRoleUpdateRequest format
### 7. Configuration Layer - NEW FILE
#### AppInitializer.java (NEW)
A new Spring Component with @EventListener for ContextRefreshedEvent that automatically initializes:
**Features:**
- Listens for Spring context refresh event
- Runs only once during application startup
- Wrapped in @Transactional for database consistency
**Initialization Steps:**
1. **Permissions Initialization** (15 permissions):
   - CREATE_PRODUCT, READ_PRODUCT, UPDATE_PRODUCT, DELETE_PRODUCT
   - CREATE_ORDER, READ_ORDER, UPDATE_ORDER, DELETE_ORDER
   - MANAGE_USERS, MANAGE_ROLES, VIEW_DASHBOARD
   - MANAGE_BRANDS, MANAGE_CATEGORIES, MANAGE_COLORS, MANAGE_VERSIONS
2. **Roles Initialization**:
   - **ADMIN**: All permissions
   - **USER**: READ_PRODUCT, CREATE_ORDER, READ_ORDER
   - **MANAGER**: Product CRUD, Order management, User management, and dashboard access
3. **Admin Account Initialization**:
   - Username: `admin`
   - Password: `admin123` (encoded)
   - Email: `admin@tuyenshop.com`
   - Full Name: `Administrator`
   - Role: ADMIN (with all permissions)
**Idempotent Design:**
- Checks if permissions exist before creating
- Checks if roles exist before creating
- Checks if admin account exists before creating
- Safe to run multiple times without duplication
**Logging:**
- INFO level logging for major events
- DEBUG level logging for created items
- ERROR handling with detailed exception logging
## Benefits
1. **Type Safety**: Role is now a proper entity instead of a String
2. **Flexibility**: Support for multiple roles per user
3. **Granular Permissions**: Each role can have specific permissions
4. **Initialization Automation**: No manual SQL required to set up the application
5. **Idempotency**: Safe to redeploy without concerns about duplicate data
6. **Audit Trail**: Logging provides visibility into initialization
## Migration Path
- Old registration assigns default "USER" role from database
- Existing APIs accept new DTO formats
- JWT tokens now include all user roles in scope claim
- Role-based authorization works with Spring Security @PreAuthorize using "SCOPE_ADMIN" format
## Testing Recommendations
1. Verify admin account is created on first startup
2. Verify permissions and roles are initialized correctly
3. Test multiple role assignment via updateUserRole endpoint
4. Verify JWT token includes all role scopes
5. Test authorizations with @PreAuthorize directives
6. Verify idempotency by restarting application
## Database Prerequisites
The database schema requires the following tables:
- `permissions` table
- `roles` table
- `role_permissions` junction table
- `users` table
- `user_roles` junction table (already exists with Set<Role> mapping)
These tables should already exist from the JPA mapping configuration.
