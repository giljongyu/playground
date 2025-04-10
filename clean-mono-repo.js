
const fs = require('fs').promises;
const path = require('path');

// 삭제 대상 디렉터리 목록
const foldersToRemove = ['node_modules', '.turbo', 'dist'];

// 해당 디렉터리를 삭제하는 함수
async function deleteDirectory(dirPath) {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    console.log(`삭제 완료: ${dirPath}`);
  } catch (error) {
    console.error(`삭제 실패 (${dirPath}):`, error);
  }
}

// 현재 디렉터리에서 재귀적으로 삭제 대상 폴더를 찾아 삭제하는 함수
async function searchAndRemove(currentDir) {
  let entries;
  try {
    entries = await fs.readdir(currentDir, { withFileTypes: true });
  } catch (error) {
    console.error(`디렉터리 읽기 실패 (${currentDir}):`, error);
    return;
  }
  
  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      if (foldersToRemove.includes(entry.name)) {
        // 삭제 대상이면 삭제
        await deleteDirectory(fullPath);
      } else {
        // 하위 디렉터리라면 재귀 탐색
        await searchAndRemove(fullPath);
      }
    }
  }
}

// 모노레포 루트(현재 작업 디렉터리)부터 시작
(async () => {
  const basePath = process.cwd();
  console.log(`모노레포 클린업 시작: ${basePath}`);
  await searchAndRemove(basePath);
  console.log('모든 대상 폴더 삭제 완료.');
})();