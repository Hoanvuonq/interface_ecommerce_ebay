import { configureStore } from "@reduxjs/toolkit";
import themeReducer from "@/store/theme/themeSlice";
import cartReducer from "@/store/theme/cartSlice";
import { useDispatch, useSelector } from "react-redux";

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    cart: cartReducer,
  },
});


export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
