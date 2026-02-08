ShopSphere — Interview-ready PRD (Condensed)

Executive Summary

ShopSphere is an API-first e-commerce platform providing REST and GraphQL endpoints, JWT authentication, and webhook-driven integrations. Phase 1 focuses on core commerce flows: product catalog, cart, checkout, orders, payments, and admin APIs.

Audience
- Product managers
- Engineering leads
- Backend/frontend developers

Success Criteria
- Functional API endpoints for product discovery, cart, checkout, and order management
- Secure JWT-based auth with token rotation
- Webhook delivery guarantees (idempotency, retries)
- Dockerized dev and production-like environment with CI

Key Decisions
- Use Django + DRF for REST, Graphene for GraphQL
- Postgres as primary DB, Redis for cache and Celery broker
- Use JWT for stateless auth and simple webhook HMAC verification

Scope (Phase 1)
- Product catalog (with variants)
- Cart & checkout
- Orders & payments (stub integration)
- Admin APIs

Open Questions
- Payment gateway selection & PCI compliance timeline
- Webhook SLA and required retry policy for external partners

For a full expanded PRD, see `docs/PRD_Expanded.md`.
