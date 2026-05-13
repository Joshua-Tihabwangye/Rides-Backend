import { Injectable } from '@nestjs/common';
import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

interface WorkspaceRepoConfig {
  id: string;
  name: string;
  path: string;
  type?: string;
}

export interface WorkspaceRepoView {
  id: string;
  name: string;
  path: string;
  type: string;
  hasGit: boolean;
  hasPackageJson: boolean;
  hasBackend: boolean;
}

@Injectable()
export class WorkspaceService {
  private readonly configFileName = 'workspace.repos.json';

  listRepos(): WorkspaceRepoView[] {
    const configured = this.readConfiguredRepos();
    if (configured.length > 0) {
      return configured.map((repo) => this.toView(repo));
    }

    return this.scanWorkspaceParent();
  }

  getRepoById(id: string): WorkspaceRepoView | null {
    return this.listRepos().find((repo) => repo.id === id) ?? null;
  }

  private readConfiguredRepos(): WorkspaceRepoConfig[] {
    const root = process.cwd();
    const explicitPath = process.env.WORKSPACE_REPOS_CONFIG?.trim();
    const configPath = explicitPath || join(root, this.configFileName);

    if (!existsSync(configPath)) {
      return [];
    }

    try {
      const parsed = JSON.parse(readFileSync(configPath, 'utf8')) as {
        repos?: WorkspaceRepoConfig[];
      };

      return Array.isArray(parsed.repos) ? parsed.repos : [];
    } catch {
      return [];
    }
  }

  private toView(repo: WorkspaceRepoConfig): WorkspaceRepoView {
    return {
      id: repo.id,
      name: repo.name,
      path: repo.path,
      type: repo.type || 'app',
      hasGit: existsSync(join(repo.path, '.git')),
      hasPackageJson: existsSync(join(repo.path, 'package.json')),
      hasBackend: existsSync(join(repo.path, 'backend')),
    };
  }

  private scanWorkspaceParent(): WorkspaceRepoView[] {
    const workspaceRoot = join(process.cwd(), '..');
    if (!existsSync(workspaceRoot)) {
      return [];
    }

    const entries = readdirSync(workspaceRoot)
      .map((name) => join(workspaceRoot, name))
      .filter((path) => {
        try {
          return statSync(path).isDirectory();
        } catch {
          return false;
        }
      });

    return entries
      .filter((path) => existsSync(join(path, '.git')))
      .map((path) => {
        const name = path.split('/').pop() || path;
        return {
          id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          name,
          path,
          type: 'app',
          hasGit: true,
          hasPackageJson: existsSync(join(path, 'package.json')),
          hasBackend: existsSync(join(path, 'backend')),
        };
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
