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

## GitHub Pages 게시
1. 이 저장소의 **Settings → Pages → Build and deployment → Source**에서 **GitHub Actions**를 선택합니다.
2. **Actions → Publish IPO Fee Benchmark Website → Run workflow**를 실행합니다.
3. 배포 성공 후 사이트는 https://juyeong0379.github.io/ipo-fee-dashboard/ 입니다.

## 매일 공개 데이터 자동 갱신 연결 (저장소 간 최소권한)
1. GitHub **Settings → Developer settings → Personal access tokens → Fine-grained tokens**에서 토큰을 새로 만듭니다.
2. 토큰의 접근 저장소를 **`juyeong0379/ipo-fee-dashboard` 하나로만 제한**하고 **Contents: Read and write** 권한만 추가합니다. 필요한 기간으로 만료기한을 설정합니다.
3. 비공개 원본 저장소 `ipo-fee-benchmark`의 **Settings → Secrets and variables → Actions → New repository secret**에서 이름을 `IPO_DASHBOARD_PUBLISH_TOKEN`으로 등록합니다.
4. 그러면 비공개 저장소의 매일 19:10(KST) 수집 작업 완료 후 `docs/data.json`, `docs/review.json`, `docs/ipo_master.csv` **세 파일만** 공개 저장소로 전송하고, 공개 저장소의 Pages 배포가 자동 실행됩니다.
5. 토큰이 없으면 수집 작업은 공개 발행을 안전하게 건너뛰며, 공개 사이트는 마지막 동기화 데이터만 보여줍니다.

**토큰 값을 채팅이나 README에 입력하지 마세요.** GitHub Actions Secret에만 저장합니다.

## 데이터 동기화
Private 원본 저장소 `ipo-fee-benchmark`에서 공개용 JSON·CSV만 복제하여 게시합니다.
GitHub Actions 예약 실행만으로 **서로 다른 저장소 간 쓰기 권한은 자동 생성되지 않습니다**. 별도 발행 토큰 설정 전까지는 수집 워크플로의 결과가 공개 사이트에 실시간 자동 반영되지 않습니다.
