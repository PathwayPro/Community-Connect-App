---
description: 
globs: 
---
# Cursor Rules for Next.js + Nest.js with Shadcn and Tailwind

## File Structure

- `src/app/**/page.tsx` - Next.js pages
- `src/app/**/layout.tsx` - Next.js layouts
- `src/app/**/loading.tsx` - Loading states
- `src/app/**/error.tsx` - Error boundaries
- `src/components/**/*.tsx` - React components
- `src/lib/**/*.ts` - Shared utilities
- `src/hooks/**/*.ts` - Custom hooks
- `src/types/**/*.ts` - TypeScript types
- `src/styles/**/*.css` - CSS/Tailwind styles
- `src/modules/**/*.ts` - Nest.js modules
- `src/common/**/*.ts` - Shared Nest.js code

## Naming Conventions

### Components
- Use PascalCase for component names
- Use kebab-case for file names
- Examples:
```typescript
// src/components/auth/login-form.tsx
export function LoginForm() {}

// src/components/dashboard/user-profile.tsx
export function UserProfile() {}
```

### Hooks
- Prefix with `use`
- Use PascalCase after `use`
- Examples:
```typescript
// src/hooks/use-auth.ts
export function useAuth() {}

// src/hooks/use-local-storage.ts
export function useLocalStorage() {}
```

### Types & Interfaces
- Prefix interfaces with `I`
- Prefix types with `T`
- Examples:
```typescript
interface IUser {
  id: string;
  name: string;
}

type TAuthStatus = 'authenticated' | 'unauthenticated';
```

## Component Structure

### Order of sections:
1. Imports
2. Types/Interfaces
3. Constants
4. Component
5. Styles

Example:
```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface IProps {
  title: string;
}

const DEFAULT_COUNT = 0;

export function Counter({ title }: IProps) {
  const [count, setCount] = useState(DEFAULT_COUNT);
  return <Button onClick={() => setCount(count + 1)}>{count}</Button>;
}
```

## Tailwind Conventions

### Class Order:
1. Layout & Position
2. Display & Spacing
3. Typography
4. Backgrounds
5. Borders
6. Effects & Transitions

Example:
```typescript
<div className="
  fixed top-0 left-0
  flex items-center justify-center
  text-sm font-medium
  bg-white dark:bg-gray-800
  border rounded-lg
  shadow-sm transition-all
">
```

## Next.js Patterns

### Client Components
```typescript
'use client';

export function ClientComponent() {
  // Client-side logic here
}
```

### Server Components
```typescript
export async function ServerComponent() {
  // Server-side logic here
}
```

## Nest.js Patterns

### Controllers
```typescript
@Controller('users')
export class UsersController {
  @Get()
  findAll() {}
}
```

### Services
```typescript
@Injectable()
export class UsersService {
  async findAll() {}
}
```

## Import Organization

Order:
1. External packages
2. Next.js/React imports
3. Internal components/utils
4. Types
5. Styles

Example:
```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import type { IUser } from '@/types';
import './styles.css';
```

## Best Practices

### Components
- Use Server Components by default
- Add 'use client' only when needed
- Implement Suspense boundaries
- Handle errors with error.tsx
- Use TypeScript strictly

### Styling
- Prefer Tailwind utility classes
- Use Shadcn UI components when available
- Follow mobile-first responsive design
- Keep components small and focused

### Performance
- Implement lazy loading for large components
- Use proper image optimization
- Cache API responses appropriately
- Minimize client-side JavaScript