package com.washinggod.tuyenshop.configuration;

import com.washinggod.tuyenshop.entity.Permission;
import com.washinggod.tuyenshop.entity.Role;
import com.washinggod.tuyenshop.entity.User;
import com.washinggod.tuyenshop.repository.PermissionRepository;
import com.washinggod.tuyenshop.repository.RoleRepository;
import com.washinggod.tuyenshop.repository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AppInitializer {

    PermissionRepository permissionRepository;
    RoleRepository roleRepository;
    UserRepository userRepository;
    PasswordEncoder passwordEncoder;

    @EventListener(ContextRefreshedEvent.class)
    @Transactional
    public void initializeApplicationData() {
        log.info("Starting application initialization...");

        try {
            // Initialize permissions
            initializePermissions();

            // Initialize roles
            initializeRoles();

            // Initialize admin account
            initializeAdminAccount();

            log.info("Application initialization completed successfully");
        } catch (Exception e) {
            log.error("Error during application initialization", e);
            throw new RuntimeException("Application initialization failed", e);
        }
    }

    private void initializePermissions() {
        log.info("Initializing permissions...");

        String[] permissionNames = {
                "CREATE_PRODUCT",
                "READ_PRODUCT",
                "UPDATE_PRODUCT",
                "DELETE_PRODUCT",
                "CREATE_ORDER",
                "READ_ORDER",
                "UPDATE_ORDER",
                "DELETE_ORDER",
                "MANAGE_USERS",
                "MANAGE_ROLES",
                "VIEW_DASHBOARD",
                "MANAGE_BRANDS",
                "MANAGE_CATEGORIES",
                "MANAGE_COLORS",
                "MANAGE_VERSIONS"
        };

        for (String permissionName : permissionNames) {
            if (permissionRepository.findByName(permissionName).isEmpty()) {
                Permission permission = Permission.builder()
                        .name(permissionName)
                        .description("Permission to " + permissionName.toLowerCase().replace("_", " "))
                        .build();
                permissionRepository.save(permission);
                log.debug("Created permission: {}", permissionName);
            }
        }

        log.info("Permissions initialization completed");
    }

    private void initializeRoles() {
        log.info("Initializing roles...");

        // Initialize ADMIN role
        if (roleRepository.findByName("ADMIN").isEmpty()) {
            Set<Permission> adminPermissions = new HashSet<>(permissionRepository.findAll());
            Role adminRole = Role.builder()
                    .name("ADMIN")
                    .description("Administrator role with full permissions")
                    .permissions(adminPermissions)
                    .build();
            roleRepository.save(adminRole);
            log.debug("Created ADMIN role with all permissions");
        }

        // Initialize USER role
        if (roleRepository.findByName("USER").isEmpty()) {
            Set<Permission> userPermissions = new HashSet<>();
            userPermissions.add(permissionRepository.findByName("READ_PRODUCT")
                    .orElseThrow(() -> new RuntimeException("Permission not found: READ_PRODUCT")));
            userPermissions.add(permissionRepository.findByName("CREATE_ORDER")
                    .orElseThrow(() -> new RuntimeException("Permission not found: CREATE_ORDER")));
            userPermissions.add(permissionRepository.findByName("READ_ORDER")
                    .orElseThrow(() -> new RuntimeException("Permission not found: READ_ORDER")));

            Role userRole = Role.builder()
                    .name("USER")
                    .description("Standard user role")
                    .permissions(userPermissions)
                    .build();
            roleRepository.save(userRole);
            log.debug("Created USER role with basic permissions");
        }

        // Initialize MANAGER role
        if (roleRepository.findByName("MANAGER").isEmpty()) {
            Set<Permission> managerPermissions = new HashSet<>();
            String[] managerPermissionNames = {
                    "CREATE_PRODUCT", "READ_PRODUCT", "UPDATE_PRODUCT",
                    "CREATE_ORDER", "READ_ORDER", "UPDATE_ORDER",
                    "MANAGE_USERS", "VIEW_DASHBOARD", "MANAGE_BRANDS",
                    "MANAGE_CATEGORIES", "MANAGE_COLORS", "MANAGE_VERSIONS"
            };

            for (String permissionName : managerPermissionNames) {
                permissionRepository.findByName(permissionName)
                        .ifPresent(managerPermissions::add);
            }

            Role managerRole = Role.builder()
                    .name("MANAGER")
                    .description("Manager role with management permissions")
                    .permissions(managerPermissions)
                    .build();
            roleRepository.save(managerRole);
            log.debug("Created MANAGER role");
        }

        log.info("Roles initialization completed");
    }

    private void initializeAdminAccount() {
        log.info("Initializing admin account...");

        String adminUsername = "admin";

        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseThrow(() -> new RuntimeException("ADMIN role not found"));

            Set<Role> roles = new HashSet<>();
            roles.add(adminRole);

            User adminUser = User.builder()
                    .username(adminUsername)
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@tuyenshop.com")
                    .fullName("Administrator")
                    .roles(roles)
                    .build();

            userRepository.save(adminUser);
            log.info("Created admin account with username: {}", adminUsername);
        } else {
            log.debug("Admin account already exists");
        }

        log.info("Admin account initialization completed");
    }
}


