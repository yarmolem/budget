import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './dialog'

import { Button } from './button'
import { Loader2 } from 'lucide-react'

type Props = {
  footer?: boolean
  isLoading?: boolean
  title?: string
  description?: string
  children?: React.ReactNode
  isOpen: boolean
  onSave?: () => void
  onCancel?: () => void
  onClose: () => void
  className?: string
}

const BasicModal = (props: Props) => {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.onClose}>
      <DialogContent className={props.className}>
        <DialogHeader>
          {(props.title || props.description) && (
            <>
              {props.title && <DialogTitle>{props.title}</DialogTitle>}
              {props.description && (
                <DialogDescription>{props.description}</DialogDescription>
              )}
            </>
          )}
        </DialogHeader>
        {props.children}
        {props.footer && (
          <DialogFooter>
            <Button
              type="button"
              variant="destructive"
              onClick={props.onCancel}
            >
              Cancelar
            </Button>
            <Button
              disabled={props.isLoading}
              type="submit"
              variant="outline"
              onClick={props.onSave}
            >
              {props.isLoading && <Loader2 className="mr-2 animate-spin" />}
              Aceptar
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { BasicModal }
