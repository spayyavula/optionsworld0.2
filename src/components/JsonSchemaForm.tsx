import React, { useState } from 'react'
import { ChevronDown, ChevronRight, Plus, Trash2, Info } from 'lucide-react'

interface JsonSchema {
  type: string
  properties?: Record<string, JsonSchema>
  items?: JsonSchema
  required?: string[]
  enum?: any[]
  title?: string
  description?: string
  default?: any
  minimum?: number
  maximum?: number
  minLength?: number
  maxLength?: number
  format?: string
}

interface JsonSchemaFormProps {
  schema: JsonSchema
  onSubmit: (data: any) => void
  initialData?: any
  submitLabel?: string
  className?: string
}

const JsonSchemaForm: React.FC<JsonSchemaFormProps> = ({
  schema,
  onSubmit,
  initialData = {},
  submitLabel = 'Submit',
  className = ''
}) => {
  const [formData, setFormData] = useState<any>(initialData)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (path: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [path]: !prev[path]
    }))
  }

  const handleChange = (path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev }
      
      // Handle nested paths (e.g., "config.settings.enabled")
      const parts = path.split('.')
      let current = newData
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]
        if (!current[part]) {
          current[part] = {}
        }
        current = current[part]
      }
      
      current[parts[parts.length - 1]] = value
      return newData
    })
  }

  const handleArrayItemAdd = (path: string) => {
    setFormData(prev => {
      const newData = { ...prev }
      const parts = path.split('.')
      let current = newData
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]
        if (!current[part]) {
          current[part] = {}
        }
        current = current[part]
      }
      
      const lastPart = parts[parts.length - 1]
      if (!current[lastPart]) {
        current[lastPart] = []
      }
      
      // Add empty item based on schema type
      const arraySchema = getSchemaAtPath(schema, path)
      if (arraySchema?.items?.type === 'object') {
        current[lastPart].push({})
      } else if (arraySchema?.items?.type === 'string') {
        current[lastPart].push('')
      } else if (arraySchema?.items?.type === 'number' || arraySchema?.items?.type === 'integer') {
        current[lastPart].push(0)
      } else if (arraySchema?.items?.type === 'boolean') {
        current[lastPart].push(false)
      } else {
        current[lastPart].push(null)
      }
      
      return newData
    })
  }

  const handleArrayItemRemove = (path: string, index: number) => {
    setFormData(prev => {
      const newData = { ...prev }
      const parts = path.split('.')
      let current = newData
      
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]
        if (!current[part]) {
          current[part] = {}
        }
        current = current[part]
      }
      
      const lastPart = parts[parts.length - 1]
      if (Array.isArray(current[lastPart])) {
        current[lastPart].splice(index, 1)
      }
      
      return newData
    })
  }

  const getSchemaAtPath = (schema: JsonSchema, path: string): JsonSchema | undefined => {
    const parts = path.split('.')
    let currentSchema = schema
    
    for (const part of parts) {
      if (currentSchema.type === 'object' && currentSchema.properties && currentSchema.properties[part]) {
        currentSchema = currentSchema.properties[part]
      } else if (currentSchema.type === 'array' && currentSchema.items) {
        currentSchema = currentSchema.items
      } else {
        return undefined
      }
    }
    
    return currentSchema
  }

  const getValueAtPath = (data: any, path: string): any => {
    const parts = path.split('.')
    let current = data
    
    for (const part of parts) {
      if (current === undefined || current === null) {
        return undefined
      }
      current = current[part]
    }
    
    return current
  }

  const renderField = (fieldSchema: JsonSchema, path: string, required: boolean = false) => {
    const value = getValueAtPath(formData, path)
    const fieldId = `field-${path.replace(/\./g, '-')}`
    
    switch (fieldSchema.type) {
      case 'string':
        if (fieldSchema.enum) {
          return (
            <select
              id={fieldId}
              className="form-select"
              value={value || ''}
              onChange={(e) => handleChange(path, e.target.value)}
              required={required}
            >
              <option value="" disabled>Select an option</option>
              {fieldSchema.enum.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )
        } else if (fieldSchema.format === 'date-time') {
          return (
            <input
              id={fieldId}
              type="datetime-local"
              className="form-input"
              value={value || ''}
              onChange={(e) => handleChange(path, e.target.value)}
              required={required}
            />
          )
        } else if (fieldSchema.format === 'date') {
          return (
            <input
              id={fieldId}
              type="date"
              className="form-input"
              value={value || ''}
              onChange={(e) => handleChange(path, e.target.value)}
              required={required}
            />
          )
        } else if (fieldSchema.format === 'email') {
          return (
            <input
              id={fieldId}
              type="email"
              className="form-input"
              value={value || ''}
              onChange={(e) => handleChange(path, e.target.value)}
              required={required}
              minLength={fieldSchema.minLength}
              maxLength={fieldSchema.maxLength}
            />
          )
        } else if (fieldSchema.format === 'uri') {
          return (
            <input
              id={fieldId}
              type="url"
              className="form-input"
              value={value || ''}
              onChange={(e) => handleChange(path, e.target.value)}
              required={required}
            />
          )
        } else {
          return (
            <input
              id={fieldId}
              type="text"
              className="form-input"
              value={value || ''}
              onChange={(e) => handleChange(path, e.target.value)}
              required={required}
              minLength={fieldSchema.minLength}
              maxLength={fieldSchema.maxLength}
            />
          )
        }
      
      case 'number':
      case 'integer':
        return (
          <input
            id={fieldId}
            type="number"
            className="form-input"
            value={value === undefined ? '' : value}
            onChange={(e) => handleChange(path, e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value)}
            required={required}
            min={fieldSchema.minimum}
            max={fieldSchema.maximum}
            step={fieldSchema.type === 'integer' ? 1 : 'any'}
          />
        )
      
      case 'boolean':
        return (
          <input
            id={fieldId}
            type="checkbox"
            className="h-4 w-4 text-blue-600 rounded"
            checked={value || false}
            onChange={(e) => handleChange(path, e.target.checked)}
          />
        )
      
      case 'object':
        if (!fieldSchema.properties) return null
        
        const isExpanded = expandedSections[path] !== false // Default to expanded
        
        return (
          <div className="border border-gray-200 rounded-lg p-4 mt-2">
            <div 
              className="flex items-center cursor-pointer mb-2" 
              onClick={() => toggleSection(path)}
            >
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
              ) : (
                <ChevronRight className="h-4 w-4 text-gray-500 mr-1" />
              )}
              <span className="font-medium text-gray-700">
                {fieldSchema.title || path.split('.').pop() || 'Object'}
              </span>
            </div>
            
            {isExpanded && (
              <div className="pl-4 border-l border-gray-200 space-y-4">
                {Object.entries(fieldSchema.properties).map(([propName, propSchema]) => {
                  const propPath = path ? `${path}.${propName}` : propName
                  const isRequired = fieldSchema.required?.includes(propName) || false
                  
                  return (
                    <div key={propPath} className="form-group">
                      <label htmlFor={`field-${propPath.replace(/\./g, '-')}`} className="form-label flex items-center">
                        {propSchema.title || propName}
                        {isRequired && <span className="text-red-500 ml-1">*</span>}
                        {propSchema.description && (
                          <div className="relative group ml-1">
                            <Info className="h-4 w-4 text-gray-400" />
                            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block bg-gray-800 text-white text-xs p-2 rounded w-48 z-10">
                              {propSchema.description}
                            </div>
                          </div>
                        )}
                      </label>
                      {renderField(propSchema, propPath, isRequired)}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      
      case 'array':
        if (!fieldSchema.items) return null
        
        const arrayValue = value || []
        const isArrayExpanded = expandedSections[path] !== false // Default to expanded
        
        return (
          <div className="border border-gray-200 rounded-lg p-4 mt-2">
            <div 
              className="flex items-center justify-between cursor-pointer mb-2"
            >
              <div 
                className="flex items-center" 
                onClick={() => toggleSection(path)}
              >
                {isArrayExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500 mr-1" />
                )}
                <span className="font-medium text-gray-700">
                  {fieldSchema.title || path.split('.').pop() || 'Array'}
                </span>
              </div>
              
              <button
                type="button"
                onClick={() => handleArrayItemAdd(path)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {isArrayExpanded && (
              <div className="pl-4 border-l border-gray-200 space-y-4">
                {arrayValue.map((_, index) => {
                  const itemPath = `${path}.${index}`
                  
                  return (
                    <div key={itemPath} className="relative border border-gray-200 rounded p-3">
                      <button
                        type="button"
                        onClick={() => handleArrayItemRemove(path, index)}
                        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      
                      <div className="mb-2 font-medium text-sm text-gray-500">
                        Item {index + 1}
                      </div>
                      
                      {renderField(fieldSchema.items, `${path}.${index}`, false)}
                    </div>
                  )
                })}
                
                {arrayValue.length === 0 && (
                  <div className="text-center py-4 text-sm text-gray-500">
                    No items. Click the + button to add an item.
                  </div>
                )}
              </div>
            )}
          </div>
        )
      
      default:
        return <div>Unsupported field type: {fieldSchema.type}</div>
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        {renderField(schema, '')}
      </div>
      
      <div className="mt-6">
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}

export default JsonSchemaForm