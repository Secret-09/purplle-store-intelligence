# Final Gap Analysis

This evaluation classifies the repository’s current implementation against the inferred Purplle Tech Challenge requirements. The classification is based on the current repository state, including the CCTV pipeline, event ingestion, analytics services, and dashboard code.

## COMPLETE

- `POST /events/ingest` endpoint with payload validation
  - Implemented in `app/api/routers/events.py`.
  - Validates `ChallengeEvent` payloads and rejects invalid events.

- Challenge event schema and event persistence pipeline
  - `app/schemas/event.py` defines `ChallengeEvent` and allowed event types.
  - `app/services/ingestion_service.py` performs deduplication and idempotent insert with PostgreSQL `ON CONFLICT DO NOTHING`.

- Core analytics APIs
  - `GET /stores/{store_id}/metrics` in `app/api/routers/stores.py` and `app/services/metrics_service.py`.
  - `GET /stores/{store_id}/funnel` in `app/api/routers/stores.py` and `app/services/funnel_service.py`.
  - `GET /stores/{store_id}/anomalies` in `app/api/routers/anomalies.py` and `app/services/anomaly_service.py`.

- Database model scaffolding for stores, events, sessions, anomalies, and transactions
  - Defined in `app/database/models/models.py`.

- Basic CCTV pipeline event generation for entrance/session events
  - `pipeline/run.py` and `pipeline/sessions.py` generate event types including `ENTRY`, `EXIT`, `REENTRY`, `ZONE_ENTER`, and `ZONE_EXIT`.

## PARTIAL

- End-to-end CCTV pipeline
  - The pipeline can generate event JSONL files, but the detection/tracking stack is implemented with best-effort fallbacks (`pipeline/detect.py`, `pipeline/tracker.py`) and the generated data may not fully align with the strict `ChallengeEvent` schema.

- Queue and billing event support
  - Code paths exist for `BILLING_QUEUE_JOIN` and `BILLING_QUEUE_ABANDON` in `pipeline/sessions.py` and analytics services.
  - The available CAM3 sample dataset contains no queue events, and purchase event generation is not present.

- Shelf interaction / zone interaction events
  - `pipeline/sessions.py` contains shelf interaction heuristics and zone dwell tracking logic.
  - The event schema does not include `SHELF_INTERACTION`, and `ZONE_DWELL` event production is not implemented, so this is only partially supported.

- Dashboard integration
  - The frontend now includes React pages for Overview, Metrics, Funnel, Heatmap, and Anomalies.
  - However, the dashboard depends on backend data and event ingestion, and end-to-end validation against live store data is not fully established.

- Testing coverage
  - Unit tests cover ingestion, metrics, funnel, and some anomaly logic.
  - Many pipeline, detection, dashboard, and deployment tests remain placeholder or absent.

## MISSING

- Staff detection / staff-aware event filtering
  - The pipeline defaults `is_staff=False` and there is no staff classifier or whitelist mechanism implemented.

- Purchase event generation and POS ingestion
  - `EventType.PURCHASE` exists in the schema, but there is no pipeline or ingestion path that generates or accepts purchase transaction events from the CCTV flow.

- Zone calibration / normalized zone coordinates
  - `config/store_zones.yaml` is pixel-based and there is no per-camera calibration or normalized coordinate system.

- `ZONE_DWELL` event generation
  - The schema supports `ZONE_DWELL`, but the pipeline and ingestion flow do not generate this event type.

- Full E2E detector→tracker→session→ingest pipeline tests
  - There are no end-to-end smoke tests validating the full CCTV pipeline from video input through event ingestion and analytics.

- Deployment and CI configuration
  - Dockerfiles, compose configuration, and CI workflows are missing or remain placeholder.

- Reliable backend event linkage
  - The repository lacks a complete workflow for mapping pipeline event output to the database session and transaction models in a fully integrated deployment.

## Notes

- The current pipeline sample data from `output/events_cam3.jsonl` confirms entrance event generation, but does not cover checkout or shelf analytics.
- The repository has strong scaffolding for ingestion and analytics, yet the full challenge scope requires additional coverage for purchase/queue workflows, staff detection, and deployment readiness.

*This analysis is based solely on the existing repository contents and does not modify any code.*