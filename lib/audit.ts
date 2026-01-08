import { getPrismaWithRLS } from './prisma-rls'

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'VIEW'
  | 'EXPORT'
  | 'GDPR_DELETE'
  | 'BULK_UPDATE'
  | 'BULK_DELETE'

export type AuditResource =
  | 'Contact'
  | 'Donation'
  | 'Campaign'
  | 'Email'
  | 'User'
  | 'Organization'
  | 'Interaction'
  | 'Task'

export interface AuditLogMetadata {
  changes?: Record<string, { old: unknown; new: unknown }>
  ipAddress?: string
  userAgent?: string
  reason?: string
  bulkCount?: number
  affectedIds?: string[]
  [key: string]: unknown
}

export interface CreateAuditLogParams {
  userId: string
  action: AuditAction
  resource: AuditResource
  resourceId?: string
  metadata?: AuditLogMetadata
}

/**
 * Creates an audit log entry for tracking user actions.
 * Non-blocking - errors are logged but don't fail the request.
 *
 * @param params - Audit log parameters
 * @returns Promise<boolean> - true if successful, false otherwise
 *
 * @example
 * ```typescript
 * await createAuditLog({
 *   userId: session.user.id,
 *   action: 'UPDATE',
 *   resource: 'Contact',
 *   resourceId: contact.id,
 *   metadata: {
 *     changes: {
 *       email: { old: 'old@email.com', new: 'new@email.com' }
 *     }
 *   }
 * })
 * ```
 */
export async function createAuditLog(
  params: CreateAuditLogParams
): Promise<boolean> {
  try {
    const prisma = await getPrismaWithRLS()

    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        resource: params.resource,
        resourceId: params.resourceId || null,
        metadata: params.metadata ? JSON.parse(JSON.stringify(params.metadata)) : null
      }
    })

    return true
  } catch (error) {
    // Log error but don't fail the request
    console.error('[Audit Log Error]', {
      action: params.action,
      resource: params.resource,
      resourceId: params.resourceId,
      error: error instanceof Error ? error.message : 'Unknown error'
    })
    return false
  }
}

/**
 * Helper to create audit log for bulk operations
 *
 * @example
 * ```typescript
 * await createBulkAuditLog({
 *   userId: session.user.id,
 *   action: 'BULK_DELETE',
 *   resource: 'Contact',
 *   affectedIds: ['id1', 'id2', 'id3'],
 *   metadata: { reason: 'User requested bulk delete' }
 * })
 * ```
 */
export async function createBulkAuditLog(
  params: Omit<CreateAuditLogParams, 'resourceId'> & {
    affectedIds: string[]
  }
): Promise<boolean> {
  return createAuditLog({
    userId: params.userId,
    action: params.action,
    resource: params.resource,
    metadata: {
      ...params.metadata,
      bulkCount: params.affectedIds.length,
      affectedIds: params.affectedIds
    }
  })
}

/**
 * Helper to build metadata with field changes
 *
 * @example
 * ```typescript
 * const metadata = buildChangeMetadata(
 *   { email: 'old@email.com', firstName: 'John' },
 *   { email: 'new@email.com', firstName: 'John' }
 * )
 * // Result: { changes: { email: { old: 'old@email.com', new: 'new@email.com' } } }
 * ```
 */
export function buildChangeMetadata<T extends Record<string, unknown>>(
  oldData: T,
  newData: T,
  excludeFields: (keyof T)[] = []
): AuditLogMetadata {
  const changes: Record<string, { old: unknown; new: unknown }> = {}

  for (const key in newData) {
    if (excludeFields.includes(key)) continue
    if (oldData[key] !== newData[key]) {
      changes[key] = {
        old: oldData[key],
        new: newData[key]
      }
    }
  }

  return { changes }
}

/**
 * Retrieves audit logs for a specific resource
 *
 * @param resource - Resource type
 * @param resourceId - Resource ID
 * @param limit - Maximum number of logs to return (default: 50)
 * @returns Array of audit logs with user information
 */
export async function getAuditLogs(
  resource: AuditResource,
  resourceId: string,
  limit: number = 50
) {
  try {
    const prisma = await getPrismaWithRLS()

    const logs = await prisma.auditLog.findMany({
      where: {
        resource,
        resourceId
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return logs
  } catch (error) {
    console.error('[Get Audit Logs Error]', error)
    return []
  }
}
