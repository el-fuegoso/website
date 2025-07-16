#!/usr/bin/env node

/**
 * Claude Code Modular Framework Validation Script
 * Validates the framework installation and configuration
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Claude Code Modular Framework...\n');

// Check directory structure
const requiredDirs = [
  '.claude/config',
  '.claude/commands/project',
  '.claude/commands/development',
  '.claude/commands/testing',
  '.claude/commands/deployment',
  '.claude/commands/documentation'
];

console.log('📁 Checking directory structure...');
for (const dir of requiredDirs) {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - MISSING`);
  }
}

// Check configuration files
const requiredConfigs = [
  '.claude/config/settings.json',
  '.claude/config/development.json',
  '.claude/config/staging.json',
  '.claude/config/production.json'
];

console.log('\n⚙️ Checking configuration files...');
for (const config of requiredConfigs) {
  if (fs.existsSync(config)) {
    try {
      const content = JSON.parse(fs.readFileSync(config, 'utf8'));
      console.log(`✅ ${config} - Valid JSON`);
    } catch (e) {
      console.log(`⚠️ ${config} - Invalid JSON: ${e.message}`);
    }
  } else {
    console.log(`❌ ${config} - MISSING`);
  }
}

// Check command files
const requiredCommands = [
  '.claude/commands/project/create-feature.md',
  '.claude/commands/project/setup-environment.md',
  '.claude/commands/project/scaffold-component.md',
  '.claude/commands/development/code-review.md',
  '.claude/commands/development/debug-issue.md',
  '.claude/commands/development/refactor-code.md',
  '.claude/commands/testing/run-tests.md',
  '.claude/commands/testing/generate-tests.md',
  '.claude/commands/deployment/deploy-staging.md',
  '.claude/commands/documentation/generate-docs.md'
];

console.log('\n📋 Checking command files...');
for (const command of requiredCommands) {
  if (fs.existsSync(command)) {
    const content = fs.readFileSync(command, 'utf8');
    if (content.includes('## Context') && content.includes('## Execution')) {
      console.log(`✅ ${command} - Valid structure`);
    } else {
      console.log(`⚠️ ${command} - Missing required sections`);
    }
  } else {
    console.log(`❌ ${command} - MISSING`);
  }
}

// Summary
console.log('\n📊 Validation Summary:');
const totalDirs = requiredDirs.length;
const totalConfigs = requiredConfigs.length;
const totalCommands = requiredCommands.length;
const existingDirs = requiredDirs.filter(dir => fs.existsSync(dir)).length;
const existingConfigs = requiredConfigs.filter(config => fs.existsSync(config)).length;
const existingCommands = requiredCommands.filter(command => fs.existsSync(command)).length;

console.log(`Directories: ${existingDirs}/${totalDirs}`);
console.log(`Configurations: ${existingConfigs}/${totalConfigs}`);
console.log(`Commands: ${existingCommands}/${totalCommands}`);

if (existingDirs === totalDirs && existingConfigs === totalConfigs && existingCommands === totalCommands) {
  console.log('\n🎉 Framework validation PASSED! All components are present and valid.');
} else {
  console.log('\n⚠️ Framework validation INCOMPLETE. Some components are missing.');
}

console.log('\n📖 Usage: Check CLAUDE.md for command syntax and examples.');
console.log('🔧 Configuration: Modify .claude/config/*.json files for environment-specific settings.');