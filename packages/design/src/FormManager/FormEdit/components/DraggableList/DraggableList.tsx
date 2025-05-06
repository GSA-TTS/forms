import React, { Children, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useFormManagerStore } from '../../../store.js';
import styles from '../../formEditStyles.module.css';
import classNames from 'classnames';

export type DraggableListPresentation =
  | 'compact'
  | 'compact-center'
  | 'default';
export type DraggableListProps = React.PropsWithChildren<{
  order: UniqueIdentifier[];
  updateOrder: (order: UniqueIdentifier[]) => void;
  presentation?: DraggableListPresentation;
}>;

export const DraggableList: React.FC<DraggableListProps> = ({
  children,
  order,
  updateOrder,
  presentation,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const arrayChildren = Children.toArray(children);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  return (
    <div
      onFocus={event => {
        // Stop onFocus events from bubbling up to parent elements.
        event.stopPropagation();
      }}
    >
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={event => {
          setActiveId(event.active.id);
        }}
        onDragEnd={event => {
          const { active, over } = event;
          setActiveId(null);

          if (over === null) {
            return;
          }
          if (active.id !== over.id) {
            const oldIndex = order.indexOf(active.id);
            const newIndex = order.indexOf(over.id);
            const newOrder = arrayMove(order, oldIndex, newIndex);
            updateOrder(newOrder);
          }
        }}
        onDragCancel={() => {
          setActiveId(null);
        }}
      >
        <ul className="add-list-reset">
          <SortableContext items={order} strategy={verticalListSortingStrategy}>
            {arrayChildren.map((child, index) => {
              const patternId = order[index];
              if (patternId === undefined) {
                console.error('undefined patternId', index);
                return;
              }
              return (
                <SortableItem
                  key={patternId}
                  id={patternId}
                  isActive={patternId === activeId}
                  isOver={patternId === activeId}
                  presentation={presentation || 'default'}
                >
                  {child}
                </SortableItem>
              );
            })}
          </SortableContext>
        </ul>

        <DragOverlay>
          {activeId ? (
            <SortableItemOverlay presentation={presentation || 'default'}>
              {arrayChildren[order.indexOf(activeId)]}
            </SortableItemOverlay>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

const SortableItemOverlay = ({
  children,
  presentation,
}: {
  children: React.ReactNode;
  presentation: DraggableListPresentation;
}) => {
  const context = useFormManagerStore(state => state.context);

  return (
    <div
      className={`${styles.draggableListItemWrapper} draggable-list-item-wrapper bg-white margin-bottom-3`}
      style={{
        boxShadow: '0 16px 24px rgba(0, 0, 0, 0.4)',
        cursor: 'grabbing',
        outline: '0.25rem solid #783cb9',
      }}
    >
      <div className="grid-row draggable-list-item">
        <div
          className={classNames('draggable-list-button', {
            'width-5 padding-1': presentation === 'compact',
            'width-5 padding-1 margin-y-2': presentation == 'compact-center',
            'grid-col-12 width-full padding-2': presentation === 'default',
          })}
          style={{
            background: '#f0f0f0',
          }}
        >
          <svg
            className="usa-icon margin-x-auto display-block"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <use
              xlinkHref={`${context.uswdsRoot}img/sprite.svg#drag_handle`}
            ></use>
          </svg>
        </div>
        <div
          className={classNames('grid-col', {
            'flex-fill':
              presentation === 'compact' || presentation == 'compact-center',
            'grid-col-12': presentation === 'default',
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

const SortableItem = ({
  id,
  children,
  isActive,
  isOver,
  presentation,
}: {
  id: UniqueIdentifier;
  children: React.ReactNode;
  isActive: boolean;
  isOver: boolean;
  presentation: DraggableListPresentation;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const context = useFormManagerStore(state => state.context);

  return (
    <li
      className={classNames(
        styles.draggableListItemWrapper,
        'draggable-list-item-wrapper',
        'bg-white',
        'cursor-pointer',
        {
          'margin-bottom-3': presentation === 'default',
          'border-top-1px':
            presentation === 'compact' || presentation == 'compact-center',
          'border-base-lighter': presentation === 'compact',
        }
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isOver ? 0.5 : 1,
        ...(isOver || presentation !== 'compact'
          ? { border: isOver ? '1px dashed #8168B3' : 'none' }
          : {}),
        outline: isOver ? 'none' : '',
      }}
    >
      <div
        className={classNames('grid-row', {
          'display-flex':
            presentation === 'compact' || presentation == 'compact-center',
        })}
      >
        <div
          className={classNames({
            'width-5 padding-1': presentation === 'compact',
            'width-5 padding-1 margin-y-2': presentation == 'compact-center',
            'grid-col-12 width-full padding-2': presentation === 'default',
          })}
          {...listeners}
          {...attributes}
          style={{
            outline: isActive ? 'none' : '',
          }}
        >
          <svg
            className="usa-icon margin-x-auto display-block"
            aria-hidden="true"
            focusable="false"
            role="img"
          >
            <use
              xlinkHref={`${context.uswdsRoot}img/sprite.svg#drag_handle`}
            ></use>
          </svg>
          <span className="usa-sr-only">Move this item</span>
        </div>
        <div
          className={classNames('grid-col', {
            'flex-fill':
              presentation === 'compact' || presentation == 'compact-center',
            'grid-col-12': presentation === 'default',
          })}
        >
          {children}
        </div>
      </div>
    </li>
  );
};
