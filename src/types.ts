// src/types.ts

export interface ProjectInfo {
    packageJson?: {
        name?: string;
        type?: string;
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
    };
    tsconfigJson?: Tsconfig;
    otherNotes?: string;
    packageManager?: 'npm' | 'yarn' | 'pnpm';
    usesESLint?: boolean;
    usesWebpack?: boolean;
    usesVite?: boolean;
    usesBabel?: boolean;
    usesJest?: boolean;
    usesDocker?: boolean;
}

export interface Tsconfig {
    extends?: string;
    compilerOptions?: Record<string, unknown>;
    include?: string[];
    exclude?: string[];
    files?: string[];
    references?: { path: string }[];

    [key: string]: unknown;
}
