import { configureStore, createSlice, getDefaultMiddleware, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "../type";
import logger from 'redux-logger';
import { v1 as uuid } from "uuid";
import { strict } from "assert";
// import {
//   createTodoActionCreator,
//   deleteTodoActionCreator,
//   editTodoActionCreator,
//   toggleTodoActionCreator
// } from "./redux-org";

///### 1.create initial state for TODO
const todosInitialState: Todo[] = [
  {
    id: uuid(),
    desc: "Learn React",
    isComplete: true
  },
  {
    id: uuid(),
    desc: "Learn Redux",
    isComplete: true
  },
  {
    id: uuid(),
    desc: "Learn Redux-ToolKit",
    isComplete: false
  }
];
// ### create slice of state for TODO
const todosSlice = createSlice({
  name: "todo", //required
  initialState: todosInitialState, //required
  reducers: {
    //create reducer
    create: {
      reducer: (
        state,
        {
          payload
        }: PayloadAction<{ id: string; desc: string; isComplete: boolean }> //### import PayloadAction Type, pass
      ) => {
        state.push(payload); // ### with immer we can directly mutate store
      },
      prepare: ({ desc }: { desc: string }) => ({
        payload: {
          id: uuid(), // we can not call uuid in reducer(because it should be pure func), that why we use additional prepare object property to prepare payload
          desc,
          isComplete: false
        }
      })
    },
    //edit reducer
    edit: (state, { payload }: PayloadAction<{ id: string; desc: string }>) => {
      const todoToEdit = state.find(todo => todo.id === payload.id);
      if (todoToEdit) {
        todoToEdit.desc = payload.desc;
      }
    },
    //reducer
    toggle: (
      state,
      { payload }: PayloadAction<{ id: string; isComplete: boolean }>
    ) => {
      const index = state.find(todo => todo.id === payload.id);
      if (index) {
        index.isComplete = payload.isComplete;
      }
    },
    //
    remove: (state, { payload }: PayloadAction<{ id: string }>) => {
      const index = state.findIndex(todo => todo.id === payload.id);
      if (index !== -1) {
        state.splice(index, 1);
      }
    }
  }
});

const selectedTodoSlice = createSlice({
  name: "selectTodo",
  initialState: null as string | null,
  reducers: {
    select: (state, { payload }: PayloadAction<{ id: string }>) => payload.id
  }
});

const counterSlice = createSlice({
  name: "counter",
  initialState: 0,
  reducers: {},
  extraReducers: {
    [todosSlice.actions.create.type]: state => state + 1,
    [todosSlice.actions.edit.type]: state => state + 1,
    [todosSlice.actions.toggle.type]: state => state + 1,
    [todosSlice.actions.remove.type]: state => state + 1
  }
});

// ### exporting actions to be dispatched in app

export const {
  create: createTodoActionCreator,
  edit: editTodoActionCreator,
  toggle: toggleTodoActionCreator,
  remove: deleteTodoActionCreator
} = todosSlice.actions;

export const { select: selectTodoActionCreator } = selectedTodoSlice.actions;
//### creating merged reducer obj
const reducer = {
  todos: todosSlice.reducer,
  selectedTodo: selectedTodoSlice.reducer,
  counter: counterSlice.reducer
};
// creating main storage
const middleware = [ ...getDefaultMiddleware(),logger]
export default configureStore({
  reducer,
  middleware,
  devTools: false
});
