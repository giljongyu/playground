# Telemetry 데이터 수집을 위한 로컬 서버

OpenTelemetry Collector, Grafana, Mimir, Tempo 및 Jaeger 를 로컬에서 구동하기 위한 환경입니다.

## start

```
$ docker-compose up
```

## stop

```
$ docker-compose down 
$ docker-compose down --volumes # 보관된 데이터를 삭제할 경우 
```

## 포함된 서비스

| 서비스                  | 주소                   |
|-------------------------|------------------------|
| OpenTelemetry Collector | http://localhost:4318  |
| Grafana                 | http://localhost:9000  |
| Jaeger                  | http://localhost:16686 |
| Tempo                   | http://tempo:3100      |
