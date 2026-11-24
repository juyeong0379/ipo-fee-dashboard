# IPO Fee Benchmark — Public Dashboard

KIND와 OpenDART의 공개 공시를 기반으로 한 IPO 인수수수료 비교 대시보드입니다.

## 수수료 데이터 사용 기준
- **검증 완료**(`verified`, `manual_verified`) 기업만 평균 기본수수료율·평균 성과수수료 상한에 포함됩니다.
- **검토 중** 기업은 상세 목록에는 표시하지만 평균에는 포함하지 않습니다.
- 기본수수료율은 계약별 분모(공모금액, 의무인수금액 등)가 다를 수 있으므로 실제 계약서를 확인해야 합니다.
- 성과수수료 상한은 실제 지급률이 아닙니다. 확인되지 않았으면 0%가 아니라 공란으로 남깁니다.

## 파일
- `docs/index.html`: 홈페이지
- `docs/data.json`: 검증 완료 기업 (평균 계산용)
- `docs/review.json`: 검토 중인 기업
- `docs/ipo_master.csv`: 검증된 IPO CSV 다운로드
- `.github/workflows/deploy_pages.yml`: GitHub Pages 자동 게시

홈페이지 공개 범위에는 공시 기반 정보만 포함합니다. **DART 인증키, 내부 제안서, 비공개 사내 자료는 게시하지 않습니다.**

## 사이트
https://juyeong0379.github.io/ipo-fee-dashboard/

저장소 Settings → Pages → Build and deployment → Source: GitHub Actions에서 게시 설정이 필요할 수 있습니다.

## 데이터 동기화
Private 원본 저장소 `ipo-fee-benchmark`에서 공개용 JSON·CSV만 복제하여 게시합니다.
GitHub Actions 예약 실행만으로 **서로 다른 저장소 간 쓰기 권한은 자동 생성되지 않습니다**. 별도 발행 토큰 설정 전까지는 수집 워크플로의 결과가 공개 사이트에 실시간 자동 반영되지 않습니다.
