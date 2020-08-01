import Vue from 'vue'
export const Bus = new Vue()

export const BusEvent = {
  SNACKBAR: 'SNACKBAR',
  OPEN_OVERLAY: 'OPEN_OVERLAY',
  CLOSE_OVERLAY: 'CLOSE_OVERLAY'
}