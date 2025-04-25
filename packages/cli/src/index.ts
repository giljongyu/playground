#!/usr/bin/env node

import { program } from "commander";
import { promises as fs } from "fs";
import path from "path";

/**
 * 지정된 디렉토리를 삭제하는 함수
 * @param {string} dirPath - 삭제할 디렉토리 경로
 * @returns {Promise<void>}
 * @example
 * await deleteDirectory('/path/to/dir');
 */
const deleteDirectory = async (dirPath: string): Promise<void> => {
  try {
    await fs.rm(dirPath, { recursive: true, force: true });
    console.log(`삭제 완료: ${dirPath}`);
  } catch (error) {
    console.error(`삭제 실패 (${dirPath}):`, error);
  }
};

/**
 * 지정된 디렉토리에서 재귀적으로 삭제 대상 폴더를 찾아 삭제하는 함수
 * @param {string} currentDir - 현재 디렉토리 경로
 * @param {string[]} patterns - 삭제할 패턴 목록
 * @param {string[]} excludePatterns - 제외할 패턴 목록
 * @returns {Promise<void>}
 */
const searchAndRemove = async (
  currentDir: string,
  patterns: string[],
  excludePatterns: string[]
): Promise<void> => {
  let entries;
  try {
    entries = await fs.readdir(currentDir, { withFileTypes: true });
  } catch (error) {
    console.error(`디렉토리 읽기 실패 (${currentDir}):`, error);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    const relativePath = path.relative(process.cwd(), fullPath);

    // 제외 패턴 확인
    const shouldExclude = excludePatterns.some((pattern) => {
      const regex = new RegExp(
        pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]*")
      );
      return regex.test(relativePath);
    });

    if (shouldExclude) {
      console.log(`제외됨: ${fullPath}`);
      continue;
    }

    if (entry.isDirectory()) {
      if (patterns.some((pattern) => entry.name.includes(pattern))) {
        await deleteDirectory(fullPath);
      } else {
        await searchAndRemove(fullPath, patterns, excludePatterns);
      }
    }
  }
};

interface CleanOptions {
  patterns?: string[];
  exclude?: string[];
}

program
  .name("clean-mono")
  .description("모노레포 클린업 CLI 도구")
  .version("0.0.1")
  .option(
    "-p, --patterns <patterns...>",
    "삭제할 패턴 목록 (기본값: node_modules,.turbo,dist)"
  )
  .option(
    "-e, --exclude <patterns...>",
    "제외할 패턴 목록 (예: **/node_modules/cache)"
  )
  .action(async (options: CleanOptions) => {
    const basePath = process.cwd();
    const defaultPatterns = ["node_modules", ".turbo", "dist"];
    const patterns = options.patterns || defaultPatterns;
    const excludePatterns = options.exclude || [];

    console.log(`모노레포 클린업 시작: ${basePath}`);
    console.log(`삭제 패턴: ${patterns.join(", ")}`);
    if (excludePatterns.length > 0) {
      console.log(`제외 패턴: ${excludePatterns.join(", ")}`);
    }

    await searchAndRemove(basePath, patterns, excludePatterns);
    console.log("모든 대상 폴더 삭제 완료.");
  });

program.parse();
