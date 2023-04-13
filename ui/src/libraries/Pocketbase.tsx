import Pocketbase from 'pocketbase';
import smartGetBackendUrl from "../helpers/smartGetBackendUrl";

const pocketbase = new Pocketbase(smartGetBackendUrl());

export default pocketbase;