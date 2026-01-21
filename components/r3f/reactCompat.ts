'use client'

import * as React from 'react'

type ClientInternals = {
  H?: unknown
  A?: { getOwner?: () => unknown } | null
  T?: unknown
  actQueue?: unknown
}

type ReactWithInternals = typeof React & {
  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED?: {
    ReactCurrentDispatcher?: { current: unknown }
    ReactCurrentBatchConfig?: { transition: unknown }
    ReactCurrentOwner?: { current: unknown }
    ReactDebugCurrentFrame?: { getStackAddendum?: () => string }
    ReactCurrentActQueue?: { current: unknown }
  }
  __CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE?: ClientInternals
}

const reactWithInternals = React as ReactWithInternals
const clientInternals =
  reactWithInternals.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE

if (!reactWithInternals.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED && clientInternals) {
  const compatInternals = {
    ReactCurrentDispatcher: {
      get current() {
        return clientInternals.H ?? null
      },
      set current(value: unknown) {
        clientInternals.H = value
      },
    },
    ReactCurrentBatchConfig: {
      get transition() {
        return clientInternals.T ?? null
      },
      set transition(value: unknown) {
        clientInternals.T = value
      },
    },
    ReactCurrentOwner: {
      get current() {
        return clientInternals.A?.getOwner?.() ?? null
      },
      set current(_value: unknown) {
        // React 19 stores owner data internally; noop for compat.
      },
    },
    ReactDebugCurrentFrame: {
      getStackAddendum() {
        return ''
      },
    },
    ReactCurrentActQueue: {
      get current() {
        return clientInternals.actQueue ?? null
      },
      set current(value: unknown) {
        clientInternals.actQueue = value
      },
    },
  }

  reactWithInternals.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED =
    compatInternals
}
