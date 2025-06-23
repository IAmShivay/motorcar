import { cn } from '@/lib/utils';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function Loading({ 
  size = 'md', 
  variant = 'spinner', 
  className,
  text 
}: LoadingProps) {
  if (variant === 'spinner') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex flex-col items-center space-y-2">
          <div
            className={cn(
              'border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin',
              sizeClasses[size]
            )}
          />
          {text && (
            <p className="text-sm text-gray-600 animate-pulse">{text}</p>
          )}
        </div>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center space-x-1', className)}>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        {text && (
          <p className="ml-3 text-sm text-gray-600">{text}</p>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className="flex flex-col items-center space-y-2">
          <div
            className={cn(
              'bg-blue-600 rounded-full animate-pulse',
              sizeClasses[size]
            )}
          />
          {text && (
            <p className="text-sm text-gray-600 animate-pulse">{text}</p>
          )}
        </div>
      </div>
    );
  }

  return null;
}

export function PageLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading size="xl" text={text} />
    </div>
  );
}

export function ButtonLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Loading size="sm" />
      <span>{text}</span>
    </div>
  );
}

export function CardLoading() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-200 rounded-lg h-48 mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function TableLoading({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse">
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
            {Array.from({ length: cols }).map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
