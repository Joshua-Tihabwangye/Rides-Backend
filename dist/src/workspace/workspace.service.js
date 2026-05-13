"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceService = void 0;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
let WorkspaceService = class WorkspaceService {
    constructor() {
        this.configFileName = 'workspace.repos.json';
    }
    listRepos() {
        const configured = this.readConfiguredRepos();
        if (configured.length > 0) {
            return configured.map((repo) => this.toView(repo));
        }
        return this.scanWorkspaceParent();
    }
    getRepoById(id) {
        return this.listRepos().find((repo) => repo.id === id) ?? null;
    }
    readConfiguredRepos() {
        const root = process.cwd();
        const explicitPath = process.env.WORKSPACE_REPOS_CONFIG?.trim();
        const configPath = explicitPath || (0, path_1.join)(root, this.configFileName);
        if (!(0, fs_1.existsSync)(configPath)) {
            return [];
        }
        try {
            const parsed = JSON.parse((0, fs_1.readFileSync)(configPath, 'utf8'));
            return Array.isArray(parsed.repos) ? parsed.repos : [];
        }
        catch {
            return [];
        }
    }
    toView(repo) {
        return {
            id: repo.id,
            name: repo.name,
            path: repo.path,
            type: repo.type || 'app',
            hasGit: (0, fs_1.existsSync)((0, path_1.join)(repo.path, '.git')),
            hasPackageJson: (0, fs_1.existsSync)((0, path_1.join)(repo.path, 'package.json')),
            hasBackend: (0, fs_1.existsSync)((0, path_1.join)(repo.path, 'backend')),
        };
    }
    scanWorkspaceParent() {
        const workspaceRoot = (0, path_1.join)(process.cwd(), '..');
        if (!(0, fs_1.existsSync)(workspaceRoot)) {
            return [];
        }
        const entries = (0, fs_1.readdirSync)(workspaceRoot)
            .map((name) => (0, path_1.join)(workspaceRoot, name))
            .filter((path) => {
            try {
                return (0, fs_1.statSync)(path).isDirectory();
            }
            catch {
                return false;
            }
        });
        return entries
            .filter((path) => (0, fs_1.existsSync)((0, path_1.join)(path, '.git')))
            .map((path) => {
            const name = path.split('/').pop() || path;
            return {
                id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                name,
                path,
                type: 'app',
                hasGit: true,
                hasPackageJson: (0, fs_1.existsSync)((0, path_1.join)(path, 'package.json')),
                hasBackend: (0, fs_1.existsSync)((0, path_1.join)(path, 'backend')),
            };
        })
            .sort((a, b) => a.name.localeCompare(b.name));
    }
};
exports.WorkspaceService = WorkspaceService;
exports.WorkspaceService = WorkspaceService = __decorate([
    (0, common_1.Injectable)()
], WorkspaceService);
//# sourceMappingURL=workspace.service.js.map