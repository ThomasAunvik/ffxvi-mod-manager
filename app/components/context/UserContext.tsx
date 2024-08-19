"use client";
import { createContext } from "react";
import { atom } from "recoil";

export interface UserAtomData {
	userId: string;
}

export const userAtom = atom<UserAtomData | null>({
	key: "user",
	default: null,
});

export interface UserAtomProviderProps {
	children: React.ReactNode;
}

export const UserAtomProvider = (props: UserAtomProviderProps) => {
	return props.children;
};
