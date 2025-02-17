import {createActionGroup, props} from '@ngrx/store';

export const collectionActions = createActionGroup({
  source: 'Collections',
  events: {
    'Load collections': props<{collections: string[]}>(),
  },
});
