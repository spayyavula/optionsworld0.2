import React from 'react'
import { Bot, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react'

type AgentStatus = 'active' | 'inactive' | 'pending' | 'error'

interface AgentStatusBadgeProps {
  status: AgentStatus
  className?: string
  showLabel?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const AgentStatusBadge: React.FC<AgentStatusBadgeProps> = ({
  status,
  className = '',
  showLabel = true,
  size = 'md'
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          icon: CheckCircle,
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          label: 'Active'
        }
      case 'inactive':
        return {
          icon: XCircle,
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: 'Inactive'
        }
      case 'pending':
        return {
          icon: Clock,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          label: 'Pending'
        }
      case 'error':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          label: 'Error'
        }
      default:
        return {
          icon: Bot,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          label: 'Unknown'
        }
    }
  }

  const { icon: Icon, bgColor, textColor, label } = getStatusConfig()
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  }
  
  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${bgColor} ${textColor} ${sizeClasses[size]} ${className}`}>
      <Icon className={`${iconSizes[size]} ${showLabel ? 'mr-1' : ''}`} />
      {showLabel && label}
    </span>
  )
}

export default AgentStatusBadge