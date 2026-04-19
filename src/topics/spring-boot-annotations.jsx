"use client"

import { useState } from "react";

const theme = {
  bg: "#0f1117",
  surface: "#1a1d24",
  surface2: "#20242e",
  border: "#2d3139",
  text: "#e5e7eb",
  muted: "#9ca3af",
  blue: "#3b82f6",
  green: "#10b981",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  red: "#ef4444",
  pink: "#ec4899",
  teal: "#14b8a6",
};

const annotations = {
  bootstrap: [
    { name: "@SpringBootApplication", pkg: "org.springframework.boot.autoconfigure", target: "Class", desc: "Meta-annotation combining @SpringBootConfiguration + @EnableAutoConfiguration + @ComponentScan. The entry-point annotation for every Spring Boot app.", attrs: "exclude, excludeName, scanBasePackages, scanBasePackageClasses", pitfall: "Placing it in a non-root package causes incomplete component scanning — always put it in the topmost package.", example: `@SpringBootApplication
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}` },
    { name: "@EnableAutoConfiguration", pkg: "org.springframework.boot.autoconfigure", target: "Class", desc: "Tells Spring Boot to auto-configure beans based on classpath dependencies. Detects DataSource, JPA, Security, etc. automatically.", attrs: "exclude (disable specific auto-configs)", pitfall: "Do not exclude auto-configs without understanding what downstream beans they provision — cascade failures are common.", example: `// Usually inherited via @SpringBootApplication
// Explicit use when building custom starters:
@Configuration
@EnableAutoConfiguration(exclude = {DataSourceAutoConfiguration.class})
public class NoDbConfig {}` },
    { name: "@SpringBootConfiguration", pkg: "org.springframework.boot.autoconfigure", target: "Class", desc: "Specialization of @Configuration that signals this is a Spring Boot configuration class. Enables configuration detection in integration tests.", attrs: "none", pitfall: "Use @SpringBootConfiguration instead of @Configuration only at the main class level. Elsewhere, use @Configuration.", example: `// Implied by @SpringBootApplication — rarely used directly
@SpringBootConfiguration
public class AppConfig {
    @Bean
    public SomeService someService() { return new SomeService(); }
}` },
  ],
  stereotype: [
    { name: "@Component", pkg: "org.springframework.stereotype", target: "Class", desc: "Generic stereotype marking a class as a Spring-managed bean eligible for component scanning. Parent of @Service, @Repository, @Controller.", attrs: "value (bean name)", pitfall: "Use the semantic specializations (@Service, @Repository) rather than raw @Component — they carry additional behavior (e.g., @Repository enables exception translation).", example: `@Component
public class EmailTemplateRenderer {
    public String render(String template, Map<String, Object> vars) {
        // logic
        return processedTemplate;
    }
}` },
    { name: "@Service", pkg: "org.springframework.stereotype", target: "Class", desc: "Marks a class as a service-layer component holding business logic. Semantically signals 'business service facade' per DDD vocabulary.", attrs: "value (bean name)", pitfall: "Fat service anti-pattern: @Service classes that do too much. Keep services focused; delegate to domain objects or helpers.", example: `@Service
@Transactional(readOnly = true)
public class OrderService {
    private final OrderRepository repo;
    
    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }
    
    @Transactional
    public Order placeOrder(PlaceOrderCommand cmd) {
        // business logic
        return repo.save(Order.create(cmd));
    }
}` },
    { name: "@Repository", pkg: "org.springframework.stereotype", target: "Class/Interface", desc: "Marks a data-access object. Beyond component scanning, enables Spring's PersistenceExceptionTranslationPostProcessor — translating vendor-specific exceptions into Spring's DataAccessException hierarchy.", attrs: "value (bean name)", pitfall: "Spring Data JPA interfaces don't need @Repository — it's inherited. Adding it is harmless but redundant.", example: `@Repository
public class JdbcOrderRepository implements OrderRepository {
    private final JdbcTemplate jdbc;
    
    // Spring translates SQLExceptions → DataAccessException automatically
    public Optional<Order> findById(UUID id) {
        return jdbc.query("SELECT * FROM orders WHERE id = ?",
            ORDER_MAPPER, id).stream().findFirst();
    }
}` },
    { name: "@Controller", pkg: "org.springframework.stereotype", target: "Class", desc: "Marks a class as a Spring MVC controller — returns view names resolved by a ViewResolver. For REST APIs returning data directly, use @RestController.", attrs: "value (bean name)", pitfall: "Forgetting @ResponseBody on individual methods when @Controller is used for REST — response written to body is silently ignored.", example: `@Controller
@RequestMapping("/dashboard")
public class DashboardController {
    @GetMapping
    public String index(Model model) {
        model.addAttribute("stats", statsService.getSummary());
        return "dashboard/index"; // resolves to template
    }
}` },
    { name: "@RestController", pkg: "org.springframework.web.bind.annotation", target: "Class", desc: "Composition of @Controller + @ResponseBody. Every method return value is serialized to the HTTP response body (JSON by default via Jackson).", attrs: "value (bean name)", pitfall: "Returning Response<T> wrappers adds serialization overhead. For streaming or reactive use, return Flux<T>/Mono<T> instead.", example: `@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    private final OrderService service;

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable UUID id) {
        return service.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest req) {
        return service.placeOrder(req);
    }
}` },
    { name: "@Configuration", pkg: "org.springframework.context.annotation", target: "Class", desc: "Declares a class as a source of @Bean definitions. Under the hood, Spring subclasses it with CGLIB to intercept @Bean calls and enforce singleton semantics.", attrs: "proxyBeanMethods (default true — set false for lite mode)", pitfall: "Setting proxyBeanMethods=false (lite mode) disables inter-bean call interception — direct calls to @Bean methods will return new instances, breaking singleton scope.", example: `@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
    
    @Bean
    public AuthenticationManager authManager(
            AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}` },
  ],
  web: [
    { name: "@RequestMapping", pkg: "org.springframework.web.bind.annotation", target: "Class/Method", desc: "Maps HTTP requests to handler methods. The base annotation — @GetMapping, @PostMapping etc. are composed shortcuts.", attrs: "value/path, method, params, headers, consumes, produces", pitfall: "Ambiguous mappings at class + method level cause UnsatisfiedServletRequestParameterException at runtime, not compile time.", example: `@RestController
@RequestMapping(value = "/api/v1/products", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProductController {
    // @GetMapping, @PostMapping etc. refine this base path
}` },
    { name: "@GetMapping / @PostMapping / @PutMapping / @PatchMapping / @DeleteMapping", pkg: "org.springframework.web.bind.annotation", target: "Method", desc: "HTTP method-specific shortcuts for @RequestMapping. @PatchMapping is for partial updates (RFC 5789); prefer over @PutMapping when only updating a subset of fields.", attrs: "value/path, params, headers, consumes, produces", pitfall: "@PutMapping is idempotent by contract — it should replace the entire resource. Using it for partial updates violates HTTP semantics.", example: `@PatchMapping("/{id}/status")
public ResponseEntity<Void> updateStatus(
        @PathVariable UUID id,
        @RequestBody @Valid StatusUpdateRequest req) {
    service.updateStatus(id, req.getStatus());
    return ResponseEntity.noContent().build();
}` },
    { name: "@PathVariable", pkg: "org.springframework.web.bind.annotation", target: "Parameter", desc: "Binds a URI template variable to a method parameter. Name is inferred from parameter name if compiler retains debug info (-parameters flag).", attrs: "name/value, required (default true)", pitfall: "Not enabling -parameters compiler flag means name inference fails — always use @PathVariable(\"id\") explicitly in shared libraries.", example: `@GetMapping("/orders/{orderId}/items/{itemId}")
public OrderItem getItem(
        @PathVariable UUID orderId,
        @PathVariable("itemId") UUID itemId) {
    return service.getItem(orderId, itemId);
}` },
    { name: "@RequestParam", pkg: "org.springframework.web.bind.annotation", target: "Parameter", desc: "Binds a query string or form parameter to a method parameter. Supports type conversion and optional binding with defaultValue.", attrs: "name/value, required (default true), defaultValue", pitfall: "defaultValue implies required=false. Setting both required=true and defaultValue is contradictory — Spring silently treats it as optional.", example: `@GetMapping("/search")
public Page<Product> search(
        @RequestParam String query,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "20") int size,
        @RequestParam(required = false) String category) {
    return service.search(query, category, PageRequest.of(page, size));
}` },
    { name: "@RequestBody", pkg: "org.springframework.web.bind.annotation", target: "Parameter", desc: "Deserializes the HTTP request body into a Java object using registered HttpMessageConverters (Jackson by default for JSON).", attrs: "required (default true)", pitfall: "Not pairing with @Valid/@Validated means bean validation constraints on the request object are silently ignored.", example: `@PostMapping("/orders")
public ResponseEntity<OrderResponse> create(
        @Valid @RequestBody CreateOrderRequest request,
        BindingResult result) {
    if (result.hasErrors()) {
        throw new ValidationException(result);
    }
    return ResponseEntity.status(HttpStatus.CREATED)
        .body(service.create(request));
}` },
    { name: "@ResponseBody", pkg: "org.springframework.web.bind.annotation", target: "Class/Method", desc: "Signals that the return value should be written directly to the HTTP response body via HttpMessageConverter. Implicit in @RestController.", attrs: "none", pitfall: "Using @ResponseBody on void methods will serialize null — return ResponseEntity<Void> and use .noContent().build() instead.", example: `// In @Controller (not @RestController):
@GetMapping("/api/data")
@ResponseBody
public DataResponse getData() {
    return service.getData(); // serialized as JSON
}` },
    { name: "@ResponseStatus", pkg: "org.springframework.web.bind.annotation", target: "Class/Method", desc: "Sets the HTTP response status code. On exception classes, it overrides the default 500 for that exception type.", attrs: "value/code, reason (sets reason phrase, deprecated in Servlet 3.0+)", pitfall: "reason attribute calls HttpServletResponse.sendError() — it bypasses Spring's error handling chain. Avoid reason in APIs; use @ControllerAdvice instead.", example: `@ResponseStatus(HttpStatus.CREATED)
@PostMapping("/users")
public UserResponse createUser(@Valid @RequestBody CreateUserRequest req) {
    return service.create(req);
}

// On custom exceptions:
@ResponseStatus(HttpStatus.NOT_FOUND)
public class OrderNotFoundException extends RuntimeException {
    public OrderNotFoundException(UUID id) {
        super("Order not found: " + id);
    }
}` },
    { name: "@ExceptionHandler", pkg: "org.springframework.web.bind.annotation", target: "Method", desc: "Handles exceptions thrown by @Controller methods within the same class. For global handling across all controllers, place in a @ControllerAdvice class.", attrs: "value (exception types to handle)", pitfall: "Local @ExceptionHandler takes precedence over @ControllerAdvice — be explicit about which exceptions each handles to avoid swallowing unintended errors.", example: `@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(ConstraintViolationException ex) {
        return ErrorResponse.from(ex.getConstraintViolations());
    }
    
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(EntityNotFoundException ex) {
        return ErrorResponse.of(ex.getMessage());
    }
}` },
    { name: "@ControllerAdvice / @RestControllerAdvice", pkg: "org.springframework.web.bind.annotation", target: "Class", desc: "Applies @ExceptionHandler, @InitBinder, and @ModelAttribute globally across all controllers. @RestControllerAdvice adds @ResponseBody.", attrs: "basePackages, basePackageClasses, assignableTypes, annotations", pitfall: "Without scope restriction (basePackages), a @ControllerAdvice intercepts exceptions from all controllers including third-party ones loaded in the context.", example: `@RestControllerAdvice(basePackages = "com.example.api")
public class ApiExceptionHandler {
    private static final Logger log = LoggerFactory.getLogger(ApiExceptionHandler.class);
    
    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ErrorResponse handleUnexpected(Exception ex, HttpServletRequest req) {
        log.error("Unhandled exception for {}", req.getRequestURI(), ex);
        return ErrorResponse.of("An unexpected error occurred");
    }
}` },
    { name: "@CrossOrigin", pkg: "org.springframework.web.bind.annotation", target: "Class/Method", desc: "Configures CORS (Cross-Origin Resource Sharing) for annotated handlers. For production, configure globally via WebMvcConfigurer.addCorsMappings().", attrs: "origins, allowedHeaders, exposedHeaders, methods, allowCredentials, maxAge", pitfall: "allowCredentials=true is incompatible with wildcard origins (*). Must specify explicit origins with credentials.", example: `// Prefer global config in production:
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("https://app.example.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE")
            .allowCredentials(true);
    }
}` },
  ],
  di: [
    { name: "@Autowired", pkg: "org.springframework.beans.factory.annotation", target: "Constructor/Field/Method", desc: "Injects dependencies by type. Constructor injection is preferred — it enables immutability, testability, and makes dependencies explicit.", attrs: "required (default true)", pitfall: "Field injection (@Autowired on fields) makes the class untestable without Spring context and hides the dependency graph. Always prefer constructor injection.", example: `// ✅ Preferred — constructor injection (no @Autowired needed in Spring 4.3+)
@Service
public class PaymentService {
    private final PaymentGateway gateway;
    private final OrderRepository repo;
    
    public PaymentService(PaymentGateway gateway, OrderRepository repo) {
        this.gateway = gateway;
        this.repo = repo;
    }
}

// ❌ Avoid — field injection
@Service
public class PaymentService {
    @Autowired private PaymentGateway gateway; // hard to test
}` },
    { name: "@Qualifier", pkg: "org.springframework.beans.factory.annotation", target: "Parameter/Field", desc: "Disambiguates when multiple beans of the same type exist. Used alongside @Autowired to select a specific bean by name or custom qualifier.", attrs: "value (bean name)", pitfall: "Qualifier values are stringly-typed — renaming a bean without updating @Qualifier usages causes NoUniqueBeanDefinitionException at startup, not at compile time.", example: `// Two PaymentGateway implementations:
@Service("stripeGateway")
public class StripeGateway implements PaymentGateway {}

@Service("paypalGateway")  
public class PaypalGateway implements PaymentGateway {}

// Injection with qualifier:
@Service
public class CheckoutService {
    private final PaymentGateway gateway;
    
    public CheckoutService(@Qualifier("stripeGateway") PaymentGateway gateway) {
        this.gateway = gateway;
    }
}` },
    { name: "@Primary", pkg: "org.springframework.context.annotation", target: "Class/Method", desc: "Marks a bean as the preferred candidate when multiple beans of the same type exist and no @Qualifier is specified.", attrs: "none", pitfall: "Overusing @Primary creates implicit coupling — the 'primary' bean wins silently. Prefer @Qualifier for explicit, readable wiring.", example: `@Configuration
public class CacheConfig {
    @Bean
    @Primary // used when @Qualifier is absent
    public CacheManager redisCacheManager(RedisConnectionFactory factory) {
        return RedisCacheManager.create(factory);
    }
    
    @Bean
    public CacheManager localCacheManager() {
        return new ConcurrentMapCacheManager();
    }
}` },
    { name: "@Value", pkg: "org.springframework.beans.factory.annotation", target: "Field/Parameter", desc: "Injects values from property sources using SpEL (Spring Expression Language) or property placeholder syntax.", attrs: "value (SpEL expression or ${prop.key} placeholder)", pitfall: "@Value on static fields does not work — Spring injects after object construction. Use @ConfigurationProperties for structured config binding.", example: `@Service
public class EmailService {
    @Value("\${mail.smtp.host}")
    private String smtpHost;
    
    @Value("\${mail.smtp.port:587}") // default 587
    private int smtpPort;
    
    @Value("#{'\${allowed.domains}'.split(',')}")  // SpEL split
    private List<String> allowedDomains;
}` },
    { name: "@ConfigurationProperties", pkg: "org.springframework.boot.context.properties", target: "Class/Method", desc: "Binds a group of properties to a typed POJO. Preferred over @Value for structured configuration — supports relaxed binding, validation, and IDE autocompletion.", attrs: "prefix, ignoreUnknownFields (default true), ignoreInvalidFields", pitfall: "Forgetting @EnableConfigurationProperties or @ConfigurationPropertiesScan means the bean never registers. In Spring Boot 2.2+ with @ConfigurationPropertiesScan it's auto-detected.", example: `@ConfigurationProperties(prefix = "payment.stripe")
@Validated
public record StripeProperties(
    @NotBlank String apiKey,
    @NotBlank String webhookSecret,
    @Positive int connectTimeoutMs,
    @Positive int readTimeoutMs
) {}

// application.yml:
// payment.stripe.api-key: sk_live_...
// payment.stripe.connect-timeout-ms: 3000` },
    { name: "@Profile", pkg: "org.springframework.context.annotation", target: "Class/Method", desc: "Conditionally registers a bean only when the specified profile(s) are active. Common profiles: dev, test, staging, prod.", attrs: "value (profile expressions; supports !, & and |)", pitfall: "Not activating any profile means @Profile beans are never registered. Always have a 'default' fallback bean or default profile.", example: `@Configuration
public class DataSourceConfig {
    @Bean
    @Profile("!prod")  // all non-prod environments
    public DataSource h2DataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.H2).build();
    }
    
    @Bean
    @Profile("prod")
    public DataSource prodDataSource(DataSourceProperties props) {
        return props.initializeDataSourceBuilder().build();
    }
}` },
    { name: "@Lazy", pkg: "org.springframework.context.annotation", target: "Class/Parameter", desc: "Defers bean initialization until first access rather than at ApplicationContext startup. Useful for expensive beans used conditionally.", attrs: "value (default true)", pitfall: "Lazy beans still fail on first access if misconfigured — errors surface later in production rather than at startup. Use sparingly.", example: `@Service
@Lazy  // initialized on first method call, not at startup
public class ReportGenerationService {
    // Expensive initialization (large cache load, etc.)
    public ReportGenerationService(ReportRepository repo) {
        // heavy setup
    }
}` },
    { name: "@Scope", pkg: "org.springframework.context.annotation", target: "Class/Method", desc: "Defines the bean lifecycle scope. Default is singleton. prototype creates a new instance per injection point. request/session scopes require a web context.", attrs: "value: singleton|prototype|request|session|application|websocket", pitfall: "Injecting a prototype-scoped bean into a singleton creates an effectively singleton prototype — use ApplicationContext.getBean() or ObjectProvider to get fresh instances.", example: `@Component
@Scope(ConfigurableBeanFactory.SCOPE_PROTOTYPE)
public class CsvReportBuilder {
    // New instance per injection — holds per-report state
    private final List<String[]> rows = new ArrayList<>();
    
    public void addRow(String... columns) { rows.add(columns); }
    public byte[] build() { /* csv serialization */ return new byte[0]; }
}

// Correct injection of prototype into singleton:
@Service
public class ReportService {
    private final ObjectProvider<CsvReportBuilder> builderProvider;
    
    public byte[] generateReport() {
        CsvReportBuilder builder = builderProvider.getObject();
        // use fresh instance
        return builder.build();
    }
}` },
  ],
  jpa: [
    { name: "@Entity", pkg: "jakarta.persistence", target: "Class", desc: "Marks a class as a JPA entity — a persistent domain object mapped to a database table. Requires a no-arg constructor (public or protected).", attrs: "name (entity name, defaults to class name)", pitfall: "Missing no-arg constructor causes InstantiationException at runtime. With Lombok, use @NoArgsConstructor(access = AccessLevel.PROTECTED).", example: `@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(nullable = false)
    private String customerId;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    @CreatedDate
    @Column(updatable = false)
    private Instant createdAt;
    
    protected Order() {} // required by JPA
    
    public Order(String customerId) {
        this.customerId = customerId;
        this.status = OrderStatus.PENDING;
    }
}` },
    { name: "@Id / @GeneratedValue", pkg: "jakarta.persistence", target: "Field", desc: "@Id designates the primary key field. @GeneratedValue specifies the generation strategy: AUTO, IDENTITY (DB auto-increment), SEQUENCE (DB sequence), UUID (Java 21+ JPA).", attrs: "strategy: AUTO|IDENTITY|SEQUENCE|TABLE|UUID; generator name", pitfall: "IDENTITY strategy disables JDBC batch inserts in Hibernate — if bulk insert performance matters, use SEQUENCE strategy instead.", example: `// UUID PK (JPA 3.1 / Spring Boot 3+):
@Id
@GeneratedValue(strategy = GenerationType.UUID)
private UUID id;

// Sequence strategy with custom sequence:
@Id
@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "order_seq")
@SequenceGenerator(name = "order_seq", sequenceName = "order_sequence",
                   allocationSize = 50) // batches 50 IDs per DB round-trip
private Long id;` },
    { name: "@Column", pkg: "jakarta.persistence", target: "Field", desc: "Maps a field to a database column. Allows customizing column name, nullability, uniqueness, length, precision, and scale.", attrs: "name, nullable, unique, length, precision, scale, insertable, updatable", pitfall: "insertable=false, updatable=false is required for computed/generated columns. Omitting them causes Hibernate to write null over database-computed values.", example: `@Entity
public class Product {
    @Column(name = "product_name", nullable = false, length = 255)
    private String name;
    
    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;
    
    @Column(name = "created_at", updatable = false)
    private Instant createdAt;
    
    @Column(columnDefinition = "TEXT")
    private String description;
}` },
    { name: "@OneToMany / @ManyToOne / @OneToOne / @ManyToMany", pkg: "jakarta.persistence", target: "Field", desc: "Define entity relationships. @OneToMany typically uses lazy loading; @ManyToOne defaults to EAGER. Always define the owning side for bidirectional relationships.", attrs: "fetch (LAZY|EAGER), cascade, mappedBy, orphanRemoval, targetEntity", pitfall: "Bidirectional @ManyToMany without a @JoinTable definition generates a table name Spring might not expect. Also: EAGER fetching on @OneToMany causes N+1 queries — always use LAZY + explicit JOIN FETCH queries.", example: `@Entity
public class Order {
    @Id @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    // LAZY is default — loaded on access
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();
    
    // addItem/removeItem helpers maintain bidirectional consistency:
    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}

@Entity
public class OrderItem {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
}` },
    { name: "@Transactional", pkg: "org.springframework.transaction.annotation", target: "Class/Method", desc: "Demarcates transaction boundaries declaratively. Spring wraps the method in a proxy that begins, commits, or rolls back a transaction. Per Spring docs (docs.spring.io): default propagation is REQUIRED, default rollback is RuntimeException/Error only.", attrs: "propagation, isolation, readOnly, timeout, rollbackFor, noRollbackFor", pitfall: "Self-invocation bypasses the proxy — calling a @Transactional method from within the same class does NOT start a new transaction. Also: only public methods are proxied.", example: `@Service
public class TransferService {
    private final AccountRepository repo;
    
    // readOnly=true hints to JPA flush mode NEVER → faster reads
    @Transactional(readOnly = true)
    public AccountSummary getSummary(UUID accountId) {
        return repo.findSummaryById(accountId);
    }
    
    // REQUIRES_NEW suspends outer tx — useful for audit logging
    @Transactional(propagation = Propagation.REQUIRES_NEW,
                   rollbackFor = InsufficientFundsException.class)
    public void transfer(UUID from, UUID to, BigDecimal amount) {
        Account source = repo.findById(from).orElseThrow();
        Account target = repo.findById(to).orElseThrow();
        source.debit(amount);   // throws InsufficientFundsException
        target.credit(amount);
        repo.save(source);
        repo.save(target);
    }
}` },
    { name: "@Query", pkg: "org.springframework.data.jpa.repository", target: "Method", desc: "Defines a JPQL or native SQL query directly on a Spring Data repository method. Named queries in JPQL are preferred; native queries for database-specific syntax.", attrs: "value (JPQL/SQL string), nativeQuery (default false), countQuery, countProjection", pitfall: "Named parameters (@Param) require -parameters compiler flag or explicit @Param annotation. Without it, parameters bind by position and silently produce wrong results.", example: `public interface OrderRepository extends JpaRepository<Order, UUID> {
    // JPQL — database-agnostic
    @Query("SELECT o FROM Order o JOIN FETCH o.items WHERE o.customerId = :customerId AND o.status = :status")
    List<Order> findByCustomerAndStatus(
        @Param("customerId") String customerId,
        @Param("status") OrderStatus status
    );
    
    // Native query for DB-specific features (window functions, etc.)
    @Query(value = "SELECT * FROM orders WHERE created_at > NOW() - INTERVAL '7 days' ORDER BY created_at DESC LIMIT :limit",
           nativeQuery = true)
    List<Order> findRecentOrders(@Param("limit") int limit);
    
    // Modifying query — requires @Modifying
    @Modifying
    @Transactional
    @Query("UPDATE Order o SET o.status = :status WHERE o.id = :id")
    int updateStatus(@Param("id") UUID id, @Param("status") OrderStatus status);
}` },
  ],
  security: [
    { name: "@EnableWebSecurity", pkg: "org.springframework.security.config.annotation.web.configuration", target: "Class", desc: "Activates Spring Security's web security support. In Spring Boot 3+, auto-configured by spring-boot-starter-security — explicit use only needed for custom SecurityFilterChain.", attrs: "debug (enables security debug logging — never in prod)", pitfall: "Spring Boot 3 deprecated WebSecurityConfigurerAdapter — do not extend it. Use @Bean SecurityFilterChain instead.", example: `@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))
            .csrf(csrf -> csrf.disable()) // disable for stateless APIs
            .sessionManagement(sess -> sess
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .build();
    }
}` },
    { name: "@PreAuthorize / @PostAuthorize", pkg: "org.springframework.security.access.prepost", target: "Method", desc: "@PreAuthorize evaluates a SpEL expression before the method executes. @PostAuthorize evaluates after — useful for filtering return values based on the result.", attrs: "value (SpEL expression)", pitfall: "Method security is implemented via AOP — it only works on beans managed by Spring. Calling a secured method from the same class bypasses the proxy.", example: `@Service
@EnableMethodSecurity // required on a @Configuration class
public class DocumentService {
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public Document getDocument(UUID documentId, UUID userId) {
        return repo.findById(documentId).orElseThrow();
    }
    
    @PostAuthorize("returnObject.owner == authentication.name")
    public Document getOwnedDocument(UUID id) {
        return repo.findById(id).orElseThrow();
    }
    
    @PreAuthorize("hasAuthority('document:write')")
    public Document updateDocument(UUID id, UpdateDocumentRequest req) {
        // only users with document:write authority
        return repo.save(req.applyTo(repo.findById(id).orElseThrow()));
    }
}` },
    { name: "@Secured", pkg: "org.springframework.security.access.annotation", target: "Method", desc: "Role-based method security annotation. Less powerful than @PreAuthorize — no SpEL support. Roles must include the ROLE_ prefix unless configured otherwise.", attrs: "value (role names array)", pitfall: "Cannot express complex conditions (AND/OR, parameter-based rules). Prefer @PreAuthorize for anything beyond simple role checks.", example: `@Secured({"ROLE_ADMIN", "ROLE_MANAGER"})
public void deleteUser(UUID userId) {
    userRepository.deleteById(userId);
}

// For complex rules, use @PreAuthorize:
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER') and #userId != authentication.principal.id")
public void deleteUser(UUID userId) {
    userRepository.deleteById(userId);
}` },
  ],
  aop: [
    { name: "@Aspect", pkg: "org.aspectj.lang.annotation", target: "Class", desc: "Declares a class as an AspectJ aspect containing pointcuts and advice. Must be a Spring bean (@Component or @Bean).", attrs: "none", pitfall: "Aspects only intercept Spring proxy calls. Calls within the same class or to non-Spring-managed objects are not advised.", example: `@Aspect
@Component
public class PerformanceMonitoringAspect {
    private static final Logger log = LoggerFactory.getLogger(PerformanceMonitoringAspect.class);
    
    @Around("@annotation(Timed)")
    public Object measureTime(ProceedingJoinPoint pjp) throws Throwable {
        long start = System.currentTimeMillis();
        try {
            return pjp.proceed();
        } finally {
            long elapsed = System.currentTimeMillis() - start;
            log.info("{} executed in {}ms", pjp.getSignature().getName(), elapsed);
        }
    }
}` },
    { name: "@Before / @After / @AfterReturning / @AfterThrowing / @Around", pkg: "org.aspectj.lang.annotation", target: "Method", desc: "Advice annotations defining when advice executes relative to the join point. @Around is most powerful — controls proceed() and can modify args/return values.", attrs: "value (pointcut expression)", pitfall: "@Around must call pjp.proceed() or the actual method never executes. Forgetting proceed() is a silent failure that causes all annotated methods to return null.", example: `@Aspect
@Component
public class AuditAspect {
    @Before("execution(* com.example.service.*Service.*(..)) && @annotation(auditable)")
    public void logBefore(JoinPoint jp, Auditable auditable) {
        log.info("AUDIT: calling {} with action {}", jp.getSignature(), auditable.action());
    }
    
    @AfterThrowing(pointcut = "execution(* com.example..*(..))", throwing = "ex")
    public void logException(JoinPoint jp, Exception ex) {
        log.error("Exception in {}: {}", jp.getSignature(), ex.getMessage());
    }
    
    @AfterReturning(pointcut = "execution(* com.example.service.OrderService.placeOrder(..))",
                    returning = "order")
    public void afterOrderPlaced(Order order) {
        eventPublisher.publishEvent(new OrderPlacedEvent(order.getId()));
    }
}` },
  ],
  testing: [
    { name: "@SpringBootTest", pkg: "org.springframework.boot.test.context", target: "Class", desc: "Loads the full Spring ApplicationContext for integration tests. Slow — use only when testing component integration. For unit tests, prefer plain JUnit + Mockito.", attrs: "webEnvironment (MOCK/RANDOM_PORT/DEFINED_PORT/NONE), classes, properties, args", pitfall: "Using @SpringBootTest for every test is a common performance anti-pattern — a full context load per test class multiplies CI time. Layer your tests: unit → slice → integration.", example: `@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
class OrderApiIntegrationTest {
    @Autowired
    private TestRestTemplate restTemplate;
    
    @MockBean // replaces the real bean in context
    private PaymentGateway paymentGateway;
    
    @Test
    void createOrder_returnsCreated() {
        when(paymentGateway.charge(any())).thenReturn(PaymentResult.success());
        
        var response = restTemplate.postForEntity("/api/v1/orders",
            new CreateOrderRequest("customer-1"), OrderResponse.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }
}` },
    { name: "@WebMvcTest", pkg: "org.springframework.boot.test.autoconfigure.web.servlet", target: "Class", desc: "Slice test that loads only the web layer (controllers, filters, advice). Faster than @SpringBootTest. All service/repository dependencies must be @MockBean.", attrs: "value/controllers (limit to specific controllers), excludeAutoConfiguration", pitfall: "Security auto-configuration is included by default — if not testing security, add @AutoConfigureMockMvc(addFilters = false) or exclude SecurityAutoConfiguration.", example: `@WebMvcTest(OrderController.class)
class OrderControllerTest {
    @Autowired
    private MockMvc mockMvc;
    
    @MockBean
    private OrderService orderService;
    
    @Test
    void getOrder_whenExists_returns200() throws Exception {
        var order = new OrderResponse(UUID.randomUUID(), "PENDING");
        when(orderService.findById(any())).thenReturn(Optional.of(order));
        
        mockMvc.perform(get("/api/v1/orders/{id}", UUID.randomUUID()))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.status").value("PENDING"));
    }
}` },
    { name: "@DataJpaTest", pkg: "org.springframework.boot.test.autoconfigure.orm.jpa", target: "Class", desc: "Slice test that configures only JPA components (entities, repositories) with an in-memory H2 database by default. Each test runs in a transaction rolled back after.", attrs: "showSql, replace (AutoConfiguredDataSource|NONE), properties", pitfall: "Using H2 for @DataJpaTest when production uses PostgreSQL can mask dialect-specific query failures. Use @AutoConfigureTestDatabase(replace = NONE) with Testcontainers for accuracy.", example: `@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class OrderRepositoryTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16");
    
    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
    }
    
    @Autowired
    private OrderRepository repository;
    
    @Test
    void findByCustomerAndStatus_returnsMatchingOrders() {
        repository.save(new Order("customer-1"));
        var results = repository.findByCustomerAndStatus("customer-1", OrderStatus.PENDING);
        assertThat(results).hasSize(1);
    }
}` },
    { name: "@MockBean / @SpyBean", pkg: "org.springframework.boot.test.mock.mockito", target: "Field", desc: "@MockBean creates a Mockito mock and registers it as a Spring bean, replacing any existing bean of that type. @SpyBean wraps the real bean in a Mockito spy.", attrs: "name, classes, answer, serializable, reset", pitfall: "@MockBean causes the Spring context to be rebuilt for each unique combination — excessive mocking multiplies test suite duration. Group tests needing the same mocks in the same class.", example: `@SpringBootTest
class PaymentServiceTest {
    @Autowired
    private PaymentService paymentService;
    
    @MockBean
    private PaymentGateway gateway; // real bean replaced with mock
    
    @SpyBean
    private AuditService auditService; // real bean wrapped in spy
    
    @Test
    void processPayment_callsGatewayAndAudit() {
        when(gateway.charge(any())).thenReturn(ChargeResult.success("ch_123"));
        
        paymentService.processPayment(new PaymentRequest("customer-1", new BigDecimal("99.99")));
        
        verify(gateway).charge(any());
        verify(auditService).record(any(AuditEvent.class)); // spy verifies real method
    }
}` },
  ],
};

const sections = [
  { id: "bootstrap", label: "Bootstrap", color: theme.amber, icon: "🚀" },
  { id: "stereotype", label: "Stereotype & IoC", color: theme.blue, icon: "🧩" },
  { id: "web", label: "Web MVC", color: theme.green, icon: "🌐" },
  { id: "di", label: "DI & Config", color: theme.purple, icon: "⚙️" },
  { id: "jpa", label: "JPA / Data", color: "#f97316", icon: "🗄️" },
  { id: "security", label: "Security", color: theme.red, icon: "🔒" },
  { id: "aop", label: "AOP", color: theme.teal, icon: "🎯" },
  { id: "testing", label: "Testing", color: theme.pink, icon: "🧪" },
];

const TABS = ["Architecture", "Core Concepts", "Implementations", "Leadership"];

function CodeBlock({ code, lang = "java" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: "relative", margin: "8px 0" }}>
      <button
        onClick={copy}
        style={{
          position: "absolute", top: 8, right: 8, zIndex: 2,
          background: copied ? theme.green : "#2d3139",
          color: copied ? "#fff" : theme.muted,
          border: "none", borderRadius: 4, padding: "3px 10px",
          fontSize: 11, cursor: "pointer", fontFamily: "monospace",
        }}
      >{copied ? "✓ Copied" : "Copy"}</button>
      <pre style={{
        background: "#161b22", borderRadius: 8,
        padding: "16px 14px", overflowX: "auto",
        margin: 0, border: `1px solid ${theme.border}`,
        fontSize: 12.5, lineHeight: 1.7,
        color: "#c9d1d9", fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}><code>{code}</code></pre>
    </div>
  );
}

function Badge({ label, color }) {
  return (
    <span style={{
      background: color + "22", color: color,
      border: `1px solid ${color}55`,
      borderRadius: 4, padding: "1px 7px", fontSize: 11, fontWeight: 600,
      marginRight: 4, display: "inline-block",
    }}>{label}</span>
  );
}

function AnnotationCard({ ann, sectionColor }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      background: theme.surface, border: `1px solid ${theme.border}`,
      borderLeft: `3px solid ${sectionColor}`,
      borderRadius: 8, marginBottom: 10, overflow: "hidden",
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          padding: "12px 16px", cursor: "pointer",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        }}
      >
        <div>
          <span style={{ fontFamily: "monospace", fontWeight: 700, color: sectionColor, fontSize: 15 }}>
            {ann.name}
          </span>
          <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
            <Badge label={ann.target} color={theme.blue} />
            <span style={{ fontSize: 11, color: theme.muted, fontFamily: "monospace" }}>{ann.pkg}</span>
          </div>
        </div>
        <span style={{ color: theme.muted, fontSize: 18, paddingLeft: 8 }}>{open ? "▲" : "▼"}</span>
      </div>
      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: `1px solid ${theme.border}` }}>
          <p style={{ color: theme.text, lineHeight: 1.6, marginTop: 12, marginBottom: 8, fontSize: 14 }}>{ann.desc}</p>
          <div style={{ marginBottom: 8 }}>
            <span style={{ color: theme.muted, fontSize: 12, fontWeight: 600 }}>ATTRIBUTES: </span>
            <span style={{ fontFamily: "monospace", fontSize: 12, color: theme.amber }}>{ann.attrs}</span>
          </div>
          <div style={{
            background: "#1f1510", border: `1px solid ${theme.red}33`,
            borderRadius: 6, padding: "8px 12px", marginBottom: 10,
          }}>
            <span style={{ color: theme.red, fontWeight: 700, fontSize: 12 }}>⚠ COMMON PITFALL: </span>
            <span style={{ color: "#fca5a5", fontSize: 13 }}>{ann.pitfall}</span>
          </div>
          <div style={{ color: theme.muted, fontSize: 12, fontWeight: 600, marginBottom: 4 }}>EXAMPLE</div>
          <CodeBlock code={ann.example} />
        </div>
      )}
    </div>
  );
}

function ArchitectureTab() {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ color: theme.text, fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Spring Boot Application Layers</h2>
        <p style={{ color: theme.muted, fontSize: 13 }}>Annotation placement by architectural layer and Spring container lifecycle</p>
      </div>
      <svg viewBox="0 0 860 560" style={{ width: "100%", borderRadius: 10, border: `1px solid ${theme.border}` }}>
        <rect width="860" height="560" fill="#0f1117" />
        {/* Layer backgrounds */}
        <rect x="20" y="20" width="820" height="68" rx="8" fill="#1a2035" stroke={theme.blue} strokeWidth="1.5" />
        <rect x="20" y="104" width="820" height="68" rx="8" fill="#1a2820" stroke={theme.green} strokeWidth="1.5" />
        <rect x="20" y="188" width="820" height="68" rx="8" fill="#1f1a2e" stroke={theme.purple} strokeWidth="1.5" />
        <rect x="20" y="272" width="820" height="68" rx="8" fill="#1f1a18" stroke="#f97316" strokeWidth="1.5" />
        <rect x="20" y="356" width="820" height="68" rx="8" fill="#1a2028" stroke={theme.teal} strokeWidth="1.5" />
        <rect x="20" y="440" width="820" height="68" rx="8" fill="#2a1a1a" stroke={theme.red} strokeWidth="1.5" />
        {/* Layer labels */}
        {[
          [30, 42, theme.blue, "CLIENT / HTTP LAYER"],
          [30, 126, theme.green, "WEB / CONTROLLER LAYER"],
          [30, 210, theme.purple, "SERVICE LAYER"],
          [30, 294, "#f97316", "DATA ACCESS / JPA LAYER"],
          [30, 378, theme.teal, "CROSS-CUTTING (AOP / Security)"],
          [30, 462, theme.red, "TESTING LAYER"],
        ].map(([x, y, color, label]) => (
          <text key={label} x={x} y={y} fill={color} fontSize="10" fontWeight="700" fontFamily="monospace" opacity="0.8">{label}</text>
        ))}
        {/* Annotation pills in each layer */}
        {[
          // Bootstrap
          { x: 200, y: 30, w: 200, label: "@SpringBootApplication", color: theme.amber },
          { x: 420, y: 30, w: 190, label: "@EnableAutoConfiguration", color: theme.amber },
          { x: 630, y: 30, w: 190, label: "@ComponentScan / @Configuration", color: theme.amber },
          // Web
          { x: 100, y: 114, w: 140, label: "@RestController", color: theme.green },
          { x: 260, y: 114, w: 120, label: "@RequestMapping", color: theme.green },
          { x: 400, y: 114, w: 110, label: "@GetMapping", color: theme.green },
          { x: 530, y: 114, w: 110, label: "@PostMapping", color: theme.green },
          { x: 660, y: 114, w: 170, label: "@ExceptionHandler / @ControllerAdvice", color: theme.green },
          // Service
          { x: 100, y: 198, w: 90, label: "@Service", color: theme.purple },
          { x: 210, y: 198, w: 110, label: "@Transactional", color: theme.purple },
          { x: 340, y: 198, w: 120, label: "@PreAuthorize", color: theme.red },
          { x: 480, y: 198, w: 90, label: "@Cacheable", color: theme.purple },
          { x: 590, y: 198, w: 90, label: "@Async", color: theme.amber },
          { x: 700, y: 198, w: 140, label: "@ConfigurationProperties", color: theme.blue },
          // JPA
          { x: 100, y: 282, w: 90, label: "@Repository", color: "#f97316" },
          { x: 210, y: 282, w: 70, label: "@Entity", color: "#f97316" },
          { x: 300, y: 282, w: 70, label: "@Table", color: "#f97316" },
          { x: 390, y: 282, w: 70, label: "@Column", color: "#f97316" },
          { x: 480, y: 282, w: 80, label: "@OneToMany", color: "#f97316" },
          { x: 580, y: 282, w: 70, label: "@Query", color: "#f97316" },
          { x: 670, y: 282, w: 140, label: "@GeneratedValue / @Id", color: "#f97316" },
          // AOP/Security
          { x: 100, y: 366, w: 80, label: "@Aspect", color: theme.teal },
          { x: 200, y: 366, w: 80, label: "@Around", color: theme.teal },
          { x: 300, y: 366, w: 80, label: "@Before", color: theme.teal },
          { x: 400, y: 366, w: 160, label: "@EnableWebSecurity", color: theme.red },
          { x: 580, y: 366, w: 80, label: "@Secured", color: theme.red },
          { x: 680, y: 366, w: 150, label: "@EnableMethodSecurity", color: theme.red },
          // Testing
          { x: 100, y: 450, w: 140, label: "@SpringBootTest", color: theme.pink },
          { x: 260, y: 450, w: 110, label: "@WebMvcTest", color: theme.pink },
          { x: 390, y: 450, w: 110, label: "@DataJpaTest", color: theme.pink },
          { x: 520, y: 450, w: 100, label: "@MockBean", color: theme.pink },
          { x: 640, y: 450, w: 100, label: "@SpyBean", color: theme.pink },
          { x: 760, y: 450, w: 80, label: "@Sql", color: theme.pink },
        ].map(({ x, y, w, label, color }) => (
          <g key={label}>
            <rect x={x} y={y} width={w} height={26} rx="4" fill={color + "22"} stroke={color + "66"} />
            <text x={x + w / 2} y={y + 16} fill={color} fontSize="9.5" fontFamily="monospace" fontWeight="600" textAnchor="middle">{label}</text>
          </g>
        ))}
        {/* Dependency injection arrows */}
        <defs>
          <marker id="arr" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={theme.muted} />
          </marker>
        </defs>
        <line x1="430" y1="88" x2="430" y2="102" stroke={theme.muted} strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="4 2" />
        <line x1="430" y1="172" x2="430" y2="186" stroke={theme.muted} strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="4 2" />
        <line x1="430" y1="256" x2="430" y2="270" stroke={theme.muted} strokeWidth="1.5" markerEnd="url(#arr)" strokeDasharray="4 2" />
        <text x="445" y="98" fill={theme.muted} fontSize="9" fontFamily="monospace">HTTP Request</text>
        <text x="445" y="182" fill={theme.muted} fontSize="9" fontFamily="monospace">@Autowired</text>
        <text x="445" y="266" fill={theme.muted} fontSize="9" fontFamily="monospace">@Autowired</text>
        {/* Legend */}
        <rect x="20" y="520" width="820" height="32" rx="6" fill="#14161c" stroke={theme.border} />
        {[
          [40, "COMMAND/INPUT", theme.blue],
          [185, "QUERY/OUTPUT", theme.green],
          [325, "STORAGE", theme.purple],
          [450, "EVENTS/ASYNC", theme.amber],
          [600, "SECURITY", theme.red],
          [720, "TESTING", theme.pink],
        ].map(([x, label, color]) => (
          <g key={label}>
            <rect x={x} y={527} width={10} height={10} rx="2" fill={color} />
            <text x={x + 14} y={537} fill={theme.muted} fontSize="9" fontFamily="monospace">{label}</text>
          </g>
        ))}
      </svg>

      {/* Cloud mapping is skipped — design patterns scope */}
      <div style={{
        marginTop: 20, background: theme.surface, borderRadius: 8,
        border: `1px solid ${theme.border}`, padding: 16,
      }}>
        <div style={{ color: theme.amber, fontWeight: 600, fontSize: 13, marginBottom: 10 }}>
          📐 Annotation Lifecycle in Spring Container
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {[
            ["1. Classpath Scan", "@Component, @Service, @Repository, @Controller — discovered", theme.blue],
            ["2. Bean Definitions", "@Configuration + @Bean — registered in BeanDefinitionRegistry", theme.green],
            ["3. Auto-Configuration", "@EnableAutoConfiguration — conditions evaluated, beans provisioned", theme.amber],
            ["4. Dependency Injection", "@Autowired, @Value, @Qualifier — dependencies wired", theme.purple],
            ["5. AOP Proxy Wrapping", "@Transactional, @Cacheable, @Async, @Aspect — proxies created", theme.teal],
            ["6. Request Handling", "@RequestMapping hierarchy — handler mapped at runtime", theme.green],
          ].map(([title, desc, color]) => (
            <div key={title} style={{
              background: "#14161c", borderRadius: 6,
              padding: "10px 12px", borderLeft: `3px solid ${color}`,
            }}>
              <div style={{ color, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>{title}</div>
              <div style={{ color: theme.muted, fontSize: 12, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConceptsTab() {
  const [activeSection, setActiveSection] = useState("bootstrap");
  const section = sections.find(s => s.id === activeSection);
  const anns = annotations[activeSection] || [];

  return (
    <div>
      {/* Section switcher */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
            background: activeSection === s.id ? s.color + "22" : theme.surface,
            color: activeSection === s.id ? s.color : theme.muted,
            border: `1px solid ${activeSection === s.id ? s.color : theme.border}`,
            borderRadius: 6, padding: "5px 12px", fontSize: 12, cursor: "pointer",
            fontWeight: activeSection === s.id ? 700 : 400,
          }}>
            {s.icon} {s.label}
          </button>
        ))}
      </div>
      <div style={{ color: section.color, fontWeight: 600, fontSize: 14, marginBottom: 12 }}>
        {section.icon} {section.label} Annotations — click any card to expand
      </div>
      {anns.map(ann => (
        <AnnotationCard key={ann.name} ann={ann} sectionColor={section.color} />
      ))}

      {/* Trade-offs */}
      <div style={{
        marginTop: 24, background: theme.surface, borderRadius: 8,
        border: `1px solid ${theme.border}`, padding: 18,
      }}>
        <div style={{ color: theme.text, fontWeight: 600, marginBottom: 12, fontSize: 15 }}>
          ⚖️ Architecture Trade-offs
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div style={{ background: theme.green + "11", borderRadius: 6, padding: "12px 14px", border: `1px solid ${theme.green}33` }}>
            <div style={{ color: theme.green, fontWeight: 700, marginBottom: 8 }}>When Spring Boot Annotations Excel</div>
            {[
              "Convention-over-configuration: 90% of apps work with defaults",
              "Testability: slice tests (@WebMvcTest, @DataJpaTest) isolate layers",
              "Declarative transactions via @Transactional reduce boilerplate drastically",
              "AOP-based cross-cutting (caching, security, auditing) without class coupling",
              "Type-safe config with @ConfigurationProperties + @Validated",
            ].map(t => <div key={t} style={{ color: theme.muted, fontSize: 12, marginBottom: 4 }}>✓ {t}</div>)}
          </div>
          <div style={{ background: theme.red + "11", borderRadius: 6, padding: "12px 14px", border: `1px solid ${theme.red}33` }}>
            <div style={{ color: theme.red, fontWeight: 700, marginBottom: 8 }}>When to Be Cautious</div>
            {[
              "Proxy-based AOP silently skips self-invocations — test explicitly",
              "@SpringBootTest full context load slows CI — use slices instead",
              "Annotation magic can obscure behavior — read Javadoc, not just tutorials",
              "@Transactional on private/protected methods is a silent no-op",
              "Fat @Service classes become God objects — enforce SRP in review",
            ].map(t => <div key={t} style={{ color: theme.muted, fontSize: 12, marginBottom: 4 }}>✗ {t}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

const implExamples = {
  complete_service: `// Pattern: Complete Spring Boot Service with all layers
// Reference: Spring Boot Reference Docs 3.x
// Production note: Constructor injection throughout; no field injection

// ── Domain ─────────────────────────────────────────────────────────────
@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String name;

    @Column(precision = 10, scale = 2, nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @Version
    private Long version; // optimistic locking

    protected Product() {}

    public Product(String name, BigDecimal price) {
        this.name = Objects.requireNonNull(name, "name required");
        this.price = Objects.requireNonNull(price, "price required");
        this.status = ProductStatus.ACTIVE;
    }
    // getters omitted for brevity
}

// ── Repository ─────────────────────────────────────────────────────────
public interface ProductRepository extends JpaRepository<Product, UUID> {
    @Query("SELECT p FROM Product p WHERE p.status = :status ORDER BY p.name")
    Page<Product> findAllByStatus(@Param("status") ProductStatus status, Pageable pageable);

    @Modifying
    @Transactional
    @Query("UPDATE Product p SET p.status = :status WHERE p.id = :id")
    int updateStatus(@Param("id") UUID id, @Param("status") ProductStatus status);
}

// ── Service ────────────────────────────────────────────────────────────
@Service
@Transactional(readOnly = true)
@Slf4j
public class ProductService {
    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public Page<Product> listActive(Pageable pageable) {
        return repository.findAllByStatus(ProductStatus.ACTIVE, pageable);
    }

    @Transactional
    public Product create(CreateProductCommand cmd) {
        log.info("Creating product: {}", cmd.name());
        return repository.save(new Product(cmd.name(), cmd.price()));
    }

    @Transactional
    public void deactivate(UUID id) {
        int updated = repository.updateStatus(id, ProductStatus.INACTIVE);
        if (updated == 0) {
            throw new EntityNotFoundException("Product not found: " + id);
        }
    }
}

// ── Controller ─────────────────────────────────────────────────────────
@RestController
@RequestMapping("/api/v1/products")
@Validated
public class ProductController {
    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public Page<ProductResponse> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") @Max(100) int size) {
        return service.listActive(PageRequest.of(page, size))
                      .map(ProductResponse::from);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAuthority('product:write')")
    public ProductResponse create(@Valid @RequestBody CreateProductRequest req) {
        return ProductResponse.from(service.create(req.toCommand()));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasRole('ADMIN')")
    public void deactivate(@PathVariable UUID id) {
        service.deactivate(id);
    }
}

// ── Exception Handling ─────────────────────────────────────────────────
@RestControllerAdvice
public class ProductExceptionHandler {
    @ExceptionHandler(EntityNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleNotFound(EntityNotFoundException ex) {
        return new ErrorResponse(ex.getMessage(), "NOT_FOUND");
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleValidation(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations().stream()
            .map(v -> v.getPropertyPath() + ": " + v.getMessage())
            .collect(Collectors.joining(", "));
        return new ErrorResponse(message, "VALIDATION_ERROR");
    }
}`,
  config: `// Pattern: Type-safe configuration with @ConfigurationProperties
// Reference: Spring Boot Docs — Externalized Configuration
// Production note: Use @Validated to fail fast on startup with bad config

@ConfigurationProperties(prefix = "app.payment")
@Validated
public record PaymentProperties(
    @NotBlank String stripeApiKey,
    @NotBlank String stripeWebhookSecret,
    @Positive @Max(30000) int connectTimeoutMs,
    @Positive @Max(60000) int readTimeoutMs,
    RetryProperties retry
) {
    public record RetryProperties(
        @Min(0) @Max(5) int maxAttempts,
        @Positive long initialBackoffMs
    ) {}
}

// Registration (Spring Boot 2.2+):
@SpringBootApplication
@ConfigurationPropertiesScan  // auto-detects @ConfigurationProperties
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}

// application.yml:
// app.payment:
//   stripe-api-key: sk_live_...
//   stripe-webhook-secret: whsec_...
//   connect-timeout-ms: 3000
//   read-timeout-ms: 10000
//   retry:
//     max-attempts: 3
//     initial-backoff-ms: 500

@Service
public class PaymentService {
    private final PaymentProperties config;
    
    public PaymentService(PaymentProperties config) {
        this.config = config;
    }
    
    public ChargeResult charge(ChargeRequest req) {
        // config.stripeApiKey(), config.retry().maxAttempts(), etc.
        return stripeClient.charge(req, config.stripeApiKey());
    }
}`,
  aop_impl: `// Pattern: AOP-based cross-cutting concerns
// Reference: Spring AOP docs; AspectJ Programming Guide
// Production note: @Around must call pjp.proceed() — missing it silently returns null

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Auditable {
    String action();
    AuditLevel level() default AuditLevel.INFO;
}

@Aspect
@Component
@Slf4j
public class AuditAspect {
    private final AuditEventRepository auditRepo;

    public AuditAspect(AuditEventRepository auditRepo) {
        this.auditRepo = auditRepo;
    }

    @Around("@annotation(auditable)")
    public Object audit(ProceedingJoinPoint pjp, Auditable auditable) throws Throwable {
        String user = SecurityContextHolder.getContext()
            .getAuthentication().getName();
        long start = System.currentTimeMillis();
        String outcome = "SUCCESS";
        try {
            Object result = pjp.proceed(); // MUST call proceed()
            return result;
        } catch (Throwable t) {
            outcome = "FAILURE: " + t.getMessage();
            throw t; // re-throw — don't swallow
        } finally {
            long elapsed = System.currentTimeMillis() - start;
            auditRepo.save(new AuditEvent(
                user, auditable.action(), outcome,
                pjp.getSignature().toShortString(), elapsed
            ));
        }
    }
}

// Usage:
@Service
public class AccountService {
    @Auditable(action = "TRANSFER_FUNDS", level = AuditLevel.WARN)
    @Transactional
    public void transfer(UUID from, UUID to, BigDecimal amount) {
        // AOP aspect records audit log automatically
    }
}`,
  security_impl: `// Pattern: Spring Security 6 with JWT (Spring Boot 3.x)
// Reference: Spring Security Reference Docs 6.x
// Production note: WebSecurityConfigurerAdapter is removed in Spring 6 — use SecurityFilterChain

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    private final JwtDecoder jwtDecoder;

    public SecurityConfig(JwtDecoder jwtDecoder) {
        this.jwtDecoder = jwtDecoder;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(AbstractHttpConfigurer::disable)
            .sessionManagement(sess ->
                sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated())
            .oauth2ResourceServer(oauth2 ->
                oauth2.jwt(jwt -> jwt
                    .decoder(jwtDecoder)
                    .jwtAuthenticationConverter(jwtAuthConverter())))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(new BearerTokenAuthenticationEntryPoint())
                .accessDeniedHandler(new BearerTokenAccessDeniedHandler()))
            .build();
    }

    private JwtAuthenticationConverter jwtAuthConverter() {
        JwtGrantedAuthoritiesConverter converter = new JwtGrantedAuthoritiesConverter();
        converter.setAuthoritiesClaimName("permissions");
        converter.setAuthorityPrefix(""); // roles come pre-prefixed from IdP
        JwtAuthenticationConverter jwtConverter = new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(converter);
        return jwtConverter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}

// Method security in service:
@Service
public class AdminService {
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteUser(UUID userId) { /* ... */ }

    @PreAuthorize("hasAuthority('report:read') and #userId == authentication.principal.subject")
    public Report getUserReport(UUID userId) { /* ... */ }
}`,
  test_impl: `// Pattern: Layered test strategy
// Reference: Spring Boot Test docs; Growing Object-Oriented Software, Guided by Tests
// Production note: Use slices (@WebMvcTest, @DataJpaTest) for speed; @SpringBootTest for integration only

// ── Unit Test (no Spring context) ──────────────────────────────────────
@ExtendWith(MockitoExtension.class)
class ProductServiceTest {
    @Mock private ProductRepository repository;
    @InjectMocks private ProductService service;

    @Test
    void create_savesProduct() {
        var cmd = new CreateProductCommand("Widget", new BigDecimal("9.99"));
        when(repository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Product result = service.create(cmd);

        assertThat(result.getName()).isEqualTo("Widget");
        verify(repository).save(any(Product.class));
    }
}

// ── Slice Test: Web Layer ───────────────────────────────────────────────
@WebMvcTest(ProductController.class)
@AutoConfigureMockMvc(addFilters = false) // skip security for unit-style web tests
class ProductControllerTest {
    @Autowired private MockMvc mockMvc;
    @Autowired private ObjectMapper objectMapper;
    @MockBean private ProductService service;

    @Test
    void create_withValidRequest_returns201() throws Exception {
        var req = new CreateProductRequest("Widget", new BigDecimal("9.99"));
        var response = new ProductResponse(UUID.randomUUID(), "Widget", new BigDecimal("9.99"));
        when(service.create(any())).thenReturn(new Product("Widget", new BigDecimal("9.99")));

        mockMvc.perform(post("/api/v1/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.name").value("Widget"));
    }

    @Test
    void create_withBlankName_returns400() throws Exception {
        var req = new CreateProductRequest("", new BigDecimal("9.99"));

        mockMvc.perform(post("/api/v1/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isBadRequest());
    }
}

// ── Slice Test: JPA Layer ───────────────────────────────────────────────
@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
class ProductRepositoryTest {
    @Container
    static PostgreSQLContainer<?> pg = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void pgProps(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", pg::getJdbcUrl);
        r.add("spring.datasource.username", pg::getUsername);
        r.add("spring.datasource.password", pg::getPassword);
    }

    @Autowired private ProductRepository repo;

    @Test
    void findAllByStatus_returnsOnlyActive() {
        repo.save(new Product("Active Widget", new BigDecimal("9.99")));
        var inactive = repo.save(new Product("Old Widget", new BigDecimal("5.00")));
        repo.updateStatus(inactive.getId(), ProductStatus.INACTIVE);

        var active = repo.findAllByStatus(ProductStatus.ACTIVE, PageRequest.of(0, 10));
        assertThat(active.getContent()).hasSize(1)
            .extracting(Product::getName).containsOnly("Active Widget");
    }
}`,
};

function ImplTab() {
  const [implSection, setImplSection] = useState("complete_service");
  const impls = [
    { id: "complete_service", label: "Full Service Example", desc: "Entity → Repository → Service → Controller → ExceptionHandler" },
    { id: "config", label: "Configuration", desc: "@ConfigurationProperties type-safe binding" },
    { id: "aop_impl", label: "AOP / Cross-cutting", desc: "Custom @Auditable annotation with @Around advice" },
    { id: "security_impl", label: "Spring Security 6", desc: "SecurityFilterChain + JWT + @PreAuthorize" },
    { id: "test_impl", label: "Test Pyramid", desc: "Unit → @WebMvcTest → @DataJpaTest with Testcontainers" },
  ];

  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
        {impls.map(i => (
          <button key={i.id} onClick={() => setImplSection(i.id)} style={{
            background: implSection === i.id ? theme.blue + "22" : theme.surface,
            color: implSection === i.id ? theme.blue : theme.muted,
            border: `1px solid ${implSection === i.id ? theme.blue : theme.border}`,
            borderRadius: 6, padding: "6px 14px", fontSize: 12, cursor: "pointer",
            fontWeight: implSection === i.id ? 700 : 400,
            textAlign: "left",
          }}>
            <div>{i.label}</div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{i.desc}</div>
          </button>
        ))}
      </div>
      <div style={{
        background: theme.surface, borderRadius: 8,
        border: `1px solid ${theme.border}`, padding: "2px 0 12px",
      }}>
        <div style={{ padding: "10px 16px 8px", borderBottom: `1px solid ${theme.border}` }}>
          <span style={{ color: theme.amber, fontFamily: "monospace", fontWeight: 600, fontSize: 13 }}>
            // Java 21 + Spring Boot 3.x
          </span>
          <span style={{ color: theme.muted, fontSize: 12, marginLeft: 12 }}>
            {impls.find(i => i.id === implSection)?.desc}
          </span>
        </div>
        <div style={{ padding: "0 12px" }}>
          <CodeBlock code={implExamples[implSection]} />
        </div>
      </div>

      {/* Quick reference table */}
      <div style={{
        marginTop: 20, background: theme.surface, borderRadius: 8,
        border: `1px solid ${theme.border}`, padding: 16,
      }}>
        <div style={{ color: theme.text, fontWeight: 600, marginBottom: 12 }}>
          📋 Annotation Quick-Reference — Layer by Layer
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, fontFamily: "monospace" }}>
            <thead>
              <tr style={{ background: "#14161c" }}>
                {["Layer", "Annotation", "Purpose", "Proxy?"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", color: theme.muted, textAlign: "left", borderBottom: `1px solid ${theme.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Bootstrap", "@SpringBootApplication", "Entry point — scan + autoconfig + config", "No"],
                ["Stereotype", "@Service", "Business logic layer", "Yes (CGLIB)"],
                ["Stereotype", "@Repository", "DAO layer + exception translation", "Yes (CGLIB)"],
                ["Web", "@RestController", "@Controller + @ResponseBody", "Yes (CGLIB)"],
                ["Web", "@RequestMapping", "HTTP endpoint mapping", "No"],
                ["Web", "@Valid/@Validated", "Triggers bean validation", "No"],
                ["DI", "@Autowired", "Dependency injection by type", "No"],
                ["DI", "@ConfigurationProperties", "Type-safe external config", "Yes (if @Validated)"],
                ["JPA", "@Entity", "Persistent domain object", "No"],
                ["JPA", "@Transactional", "Declarative tx management", "Yes (JDK/CGLIB)"],
                ["JPA", "@Query", "Custom JPQL/SQL on repo method", "No"],
                ["Security", "@PreAuthorize", "Method-level SpEL security check", "Yes (CGLIB)"],
                ["AOP", "@Aspect", "Cross-cutting concern class", "Yes (CGLIB)"],
                ["AOP", "@Around", "Full method interception advice", "N/A"],
                ["Test", "@SpringBootTest", "Full context integration test", "N/A"],
                ["Test", "@WebMvcTest", "Web layer slice test", "N/A"],
                ["Test", "@MockBean", "Mock bean in context", "N/A"],
              ].map(([layer, ann, purpose, proxy], idx) => (
                <tr key={ann} style={{ background: idx % 2 === 0 ? "transparent" : "#14161c" }}>
                  <td style={{ padding: "6px 12px", color: theme.muted, borderBottom: `1px solid ${theme.border}22` }}>{layer}</td>
                  <td style={{ padding: "6px 12px", color: theme.amber, borderBottom: `1px solid ${theme.border}22` }}>{ann}</td>
                  <td style={{ padding: "6px 12px", color: theme.text, borderBottom: `1px solid ${theme.border}22` }}>{purpose}</td>
                  <td style={{ padding: "6px 12px", color: proxy === "Yes (CGLIB)" || proxy === "Yes (JDK/CGLIB)" ? theme.red : proxy === "No" ? theme.green : theme.muted, borderBottom: `1px solid ${theme.border}22` }}>{proxy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function LeadershipTab() {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {/* Standup summary */}
      <div style={{ background: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, padding: 18 }}>
        <div style={{ color: theme.blue, fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
          🗣️ Explain to Your Team (3-sentence standup/RFC intro)
        </div>
        <div style={{
          background: "#14161c", borderRadius: 6, padding: "12px 16px",
          borderLeft: `3px solid ${theme.blue}`, color: theme.text, fontSize: 14, lineHeight: 1.8,
        }}>
          Spring Boot's annotation model is a layered metadata system: stereotype annotations (@Service, @Repository, @Controller) register beans; 
          behavior annotations (@Transactional, @Cacheable, @PreAuthorize) wrap those beans in CGLIB proxies that intercept method calls; 
          and slice test annotations (@WebMvcTest, @DataJpaTest) let us load only the layer we're testing, keeping the suite fast without sacrificing confidence.
        </div>
      </div>

      {/* Justify the decision */}
      <div style={{ background: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, padding: 18 }}>
        <div style={{ color: theme.green, fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
          🏛️ Justify the Decision (Architecture Review)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            ["vs. Manual XML Config", "Annotations are co-located with the code they describe — misalignment is compile-visible. XML config diverges invisibly from the code it configures.", theme.green],
            ["vs. No Framework", "@Transactional alone eliminates 50+ lines of try/catch/finally JDBC boilerplate per method. The Spring proxy handles begin/commit/rollback correctly in 95% of cases.", theme.green],
            ["vs. Quarkus/Micronaut", "Spring Boot's annotation processing is runtime-based (CGLIB) vs compile-time. Trade-off: Spring has better ecosystem and tooling maturity; Quarkus offers faster startup and native image readiness.", theme.amber],
            ["Proxies are the key risk", "All behavior annotations depend on Spring proxies. Annotate public methods on Spring beans. Self-invocations bypass the proxy. Document this constraint in your team's ADR.", theme.red],
          ].map(([title, text, color]) => (
            <div key={title} style={{ background: "#14161c", borderRadius: 6, padding: "10px 12px", borderLeft: `3px solid ${color}` }}>
              <div style={{ color, fontWeight: 700, fontSize: 12, marginBottom: 6 }}>{title}</div>
              <div style={{ color: theme.muted, fontSize: 12, lineHeight: 1.6 }}>{text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Failure modes */}
      <div style={{ background: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, padding: 18 }}>
        <div style={{ color: theme.red, fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
          💥 Failure Modes & Observability
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {[
            {
              mode: "@Transactional self-invocation bypass",
              symptom: "Data inconsistency in production; no exception thrown",
              detect: "Integration test calling the outer method → verify inner method's side-effect is atomic",
              alert: "Prometheus counter on DataAccessException.class; alert on spike",
            },
            {
              mode: "EAGER fetch on @OneToMany → N+1 queries",
              symptom: "Endpoint latency grows linearly with collection size",
              detect: "Hibernate SQL logging (`spring.jpa.show-sql=true`) in staging; Datadog APM query count",
              alert: "Alert on p99 latency > 500ms on read endpoints; track via Micrometer `spring.data.repository.invocations`",
            },
            {
              mode: "@SpringBootTest context cache miss",
              symptom: "CI build time balloons to 20+ minutes",
              detect: "Count context loads in test output: `[main] INFO o.s.t.c.cache.DefaultCacheAwareContextLoaderDelegate`",
              alert: "Track CI build duration as a metric; budget alert on threshold breach",
            },
            {
              mode: "@ConfigurationProperties binding failure",
              symptom: "Application fails to start; BindException with missing property",
              detect: "Startup log: `Binding to target ... failed`; `@Validated` triggers ConstraintViolationException at startup",
              alert: "Startup health check in CD pipeline; canary deploys catch before full rollout",
            },
          ].map(item => (
            <div key={item.mode} style={{ background: "#14161c", borderRadius: 6, padding: "10px 14px" }}>
              <div style={{ color: theme.red, fontWeight: 700, fontSize: 12, marginBottom: 4 }}>⚡ {item.mode}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div><span style={{ color: theme.amber, fontSize: 11, fontWeight: 600 }}>SYMPTOM: </span><span style={{ color: theme.muted, fontSize: 11 }}>{item.symptom}</span></div>
                <div><span style={{ color: theme.blue, fontSize: 11, fontWeight: 600 }}>DETECT: </span><span style={{ color: theme.muted, fontSize: 11 }}>{item.detect}</span></div>
                <div><span style={{ color: theme.green, fontSize: 11, fontWeight: 600 }}>ALERT: </span><span style={{ color: theme.muted, fontSize: 11 }}>{item.alert}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scale implications */}
      <div style={{ background: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, padding: 18 }}>
        <div style={{ color: theme.purple, fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
          📈 Scale Implications
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            ["Current → 10x traffic", "@Transactional(readOnly=true) becomes critical — ensure all read paths use it. Connection pool sizing (HikariCP maxPoolSize) needs calibration. Add @Cacheable on stable reads.", theme.blue],
            ["10x → 100x traffic", "@OneToMany LAZY + JOIN FETCH queries must be audited. Consider CQRS split — read-model via @Query projections, write-model via @Transactional services. Database connection pooling may become the bottleneck.", theme.amber],
            ["100x+ / Microservices", "@Transactional cannot span service boundaries — evaluate Saga pattern. @Async + message queues replace synchronous service calls. Spring Cloud annotations (@EnableFeignClients, @EnableDiscoveryClient) enter the picture.", theme.red],
          ].map(([title, text, color]) => (
            <div key={title} style={{ background: "#14161c", borderRadius: 6, padding: "12px 14px", borderTop: `3px solid ${color}` }}>
              <div style={{ color, fontWeight: 700, fontSize: 12, marginBottom: 8 }}>{title}</div>
              <div style={{ color: theme.muted, fontSize: 12, lineHeight: 1.6 }}>{text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Code review checklist */}
      <div style={{ background: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, padding: 18 }}>
        <div style={{ color: theme.teal, fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
          ✅ Code Review Checklist — Spring Boot Annotations
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {[
            ["Constructor injection", "All @Service, @Repository, @Controller use constructor injection — no @Autowired on fields"],
            ["@Transactional scope", "@Transactional on public methods only; readOnly=true on all query methods"],
            ["@Transactional self-call", "No @Transactional method called from the same class without programmatic transaction"],
            ["Fetch strategy", "No @OneToMany(fetch=EAGER) — verify all collections use JOIN FETCH in queries that need them"],
            ["@ExceptionHandler scope", "@ControllerAdvice has basePackages scoped; not a catch-all for all exceptions globally"],
            ["@PreAuthorize", "Every mutating endpoint has @PreAuthorize or SecurityFilterChain restriction"],
            ["@Valid on @RequestBody", "All POST/PUT request bodies are annotated with @Valid or @Validated"],
            ["Test slice usage", "Integration-only logic uses @WebMvcTest/@DataJpaTest; @SpringBootTest reserved for true integration"],
            ["@ConfigurationProperties", "Config classes use @ConfigurationProperties + @Validated, not scattered @Value injections"],
            ["@Aspect proceed()", "Every @Around advice calls pjp.proceed() and re-throws Throwable, not swallows"],
          ].map(([title, desc]) => (
            <div key={title} style={{ display: "flex", gap: 8, padding: "6px 10px", background: "#14161c", borderRadius: 5 }}>
              <span style={{ color: theme.green, marginTop: 1, flexShrink: 0 }}>□</span>
              <div>
                <span style={{ color: theme.text, fontWeight: 600, fontSize: 12 }}>{title}: </span>
                <span style={{ color: theme.muted, fontSize: 12 }}>{desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Design review questions */}
      <div style={{ background: theme.surface, borderRadius: 8, border: `1px solid ${theme.border}`, padding: 18 }}>
        <div style={{ color: theme.amber, fontWeight: 700, marginBottom: 10, fontSize: 14 }}>
          ❓ Design Review Questions
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {[
            ["What's the transaction boundary?", "Where does the @Transactional annotation sit? What happens if the method throws a checked exception — does it roll back? Have you tested the failure path?"],
            ["How are you testing the security rules?", "Is there a @WebMvcTest that verifies unauthorized callers get 401/403? Do @PreAuthorize SpEL expressions have unit coverage?"],
            ["What's the fetch strategy for collections?", "How many SQL queries does this endpoint generate? Have you verified with Hibernate SQL logging under realistic load?"],
            ["How do you configure for each environment?", "Is configuration in @ConfigurationProperties with @Validated? What happens at startup if a required property is missing in prod?"],
            ["Are cross-cutting concerns centralized?", "Is @ExceptionHandler in a @ControllerAdvice? Is logging/auditing via @Aspect rather than duplicated in each service method?"],
            ["Test pyramid balance?", "Ratio of unit tests to @SpringBootTest integration tests? If > 50% integration tests, the suite will become slow to run and slow to debug."],
          ].map(([q, detail]) => (
            <div key={q} style={{ background: "#14161c", borderRadius: 6, padding: "10px 14px" }}>
              <div style={{ color: theme.amber, fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{q}</div>
              <div style={{ color: theme.muted, fontSize: 12, lineHeight: 1.6 }}>{detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SpringBootAnnotations() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{
      minHeight: "100vh", background: theme.bg,
      color: theme.text, fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: theme.surface, borderBottom: `1px solid ${theme.border}`,
        padding: "16px 24px", position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{
              background: "#f97316", width: 32, height: 32, borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>🌱</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 17, color: theme.text }}>Spring Boot Annotations</div>
              <div style={{ color: theme.muted, fontSize: 12 }}>
                Reference: Spring Boot 3.x · Spring Framework 6.x · Spring Security 6.x · Jakarta EE 10
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setActiveTab(i)} style={{
                background: activeTab === i ? "#f97316" + "22" : "transparent",
                color: activeTab === i ? "#f97316" : theme.muted,
                border: `1px solid ${activeTab === i ? "#f97316" : "transparent"}`,
                borderRadius: 6, padding: "5px 14px", fontSize: 13,
                cursor: "pointer", fontWeight: activeTab === i ? 700 : 400,
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 20px" }}>
        {activeTab === 0 && <ArchitectureTab />}
        {activeTab === 1 && <ConceptsTab />}
        {activeTab === 2 && <ImplTab />}
        {activeTab === 3 && <LeadershipTab />}
      </div>
    </div>
  );
}
