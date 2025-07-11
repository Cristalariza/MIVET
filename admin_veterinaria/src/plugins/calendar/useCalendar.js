import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import timeGridPlugin from '@fullcalendar/timegrid'
import { useConfigStore } from '@core/stores/config'
import { useCalendarStore } from '@/plugins/calendar/useCalendarStore'

export const blankEvent = {
  title: '',
  start: '',
  end: '',
  allDay: false,
  url: '',
  extendedProps: {
    /*
          ℹ️ We have to use undefined here because if we have blank string as value then select placeholder will be active (moved to top).
          Hence, we need to set it to undefined or null
        */
    calendar: undefined,
    guests: [],
    location: '',
    description: '',
    pet: {
      name: '',
    },
    veterinarie: {
      full_name: ''
    },
    state: 1,
    notes: '',
  },
}

const date = new Date()
const nextDay = new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
const nextMonth = date.getMonth() === 11 ? new Date(date.getFullYear() + 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() + 1, 1)
const prevMonth = date.getMonth() === 11 ? new Date(date.getFullYear() - 1, 0, 1) : new Date(date.getFullYear(), date.getMonth() - 1, 1)
// start: '2024-07-11T18:50:00',
    // end: '2024-07-15T18:50:00',
export const events = [
  {
    id: 1,
    url: '',
    title: 'Design Review',
    start: date,
    end: nextDay,
    allDay: false,
    extendedProps: {
      calendar: 'Business',
    },
  },
  {
    id: 2,
    url: '',
    title: 'Meeting With Client',
    start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
    allDay: true,
    extendedProps: {
      calendar: 'Business',
    },
  },
  {
    id: 3,
    url: '',
    title: 'Family Trip',
    allDay: true,
    start: new Date('2024-11-21 10:00:00'),//date.getFullYear(), date.getMonth() + 1, -9
    end: new Date('2024-11-21 10:15:00'),//date.getFullYear(), date.getMonth() + 1, -7
    extendedProps: {
      calendar: 'Holiday',
    },
  },
  {
    id: 4,
    url: '',
    title: 'Doctor\'s Appointment',
    start: new Date(date.getFullYear(), date.getMonth() + 1, -11),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -10),
    allDay: true,
    extendedProps: {
      calendar: 'Personal',
    },
  },
  {
    id: 5,
    url: '',
    title: 'Dart Game?',
    start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
    allDay: true,
    extendedProps: {
      calendar: 'ETC',
    },
  },
  {
    id: 6,
    url: '',
    title: 'Meditation',
    start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
    allDay: true,
    extendedProps: {
      calendar: 'Personal',
    },
  },
  {
    id: 7,
    url: '',
    title: 'Dinner',
    start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
    allDay: true,
    extendedProps: {
      calendar: 'Family',
    },
  },
  {
    id: 8,
    url: '',
    title: 'Product Review',
    start: new Date(date.getFullYear(), date.getMonth() + 1, -13),
    end: new Date(date.getFullYear(), date.getMonth() + 1, -12),
    allDay: true,
    extendedProps: {
      calendar: 'Business',
    },
  },
  {
    id: 9,
    url: '',
    title: 'Monthly Meeting',
    start: nextMonth,
    end: nextMonth,
    allDay: true,
    extendedProps: {
      calendar: 'Business',
    },
  },
  {
    id: 10,
    url: '',
    title: 'Monthly Checkup',
    start: prevMonth,
    end: prevMonth,
    allDay: true,
    extendedProps: {
      calendar: 'Personal',
    },
  },
];
export const useCalendar = (event, isEventHandlerSidebarActive, isLeftSidebarOpen) => {
  const configStore = useConfigStore()

  // 👉 Store
  const store = useCalendarStore()

  // 👉 Calendar template ref
  const refCalendar = ref()


  // 👉 Calendar colors
  const calendarsColor = {
    Appointment: 'primary',
    Surgeries: 'success',
    Personal: 'error',
    Vaccination: 'warning',
    ETC: 'info',
  }


  // ℹ️ Extract event data from event API
  const extractEventDataFromEventApi = eventApi => {
        
    const { id, title, start, end, url, extendedProps: { calendar, guests, location, description ,pet,veterinarie,state,notes,day,amount }, allDay } = eventApi
    
    return {
      id,
      title,
      start,
      end,
      url,
      extendedProps: {
        calendar,
        guests,
        location,
        description,
        pet,
        veterinarie,
        state,
        notes,
        day,
        amount
      },
      allDay,
    }
  }
    
  if (typeof process !== 'undefined' && process.server)
    store.fetchEvents()


  // 👉 Fetch events
  const fetchEvents = (info, successCallback) => {
    // If there's no info => Don't make useless API call
    if (!info)
      return

    console.log(events);
    // successCallback(events.map(e => ({
    //   ...e,

    //   // Convert string representation of date to Date object
    //   start: new Date(e.start),
    //   end: new Date(e.end),
    // })))
    store.fetchEvents()
      .then(r => {
        successCallback(r.map(e => ({
          ...e,

          // Convert string representation of date to Date object
          start: new Date(e.start),
          end: new Date(e.end),
        })))
      })
      .catch(e => {
        console.error('Error occurred while fetching calendar events', e)
      })
  }


  // 👉 Calendar API
  const calendarApi = ref(null)


  // 👉 Update event in calendar [UI]
  const updateEventInCalendar = (updatedEventData, propsToUpdate, extendedPropsToUpdate) => {
    const existingEvent = calendarApi.value?.getEventById(String(updatedEventData.id))
    if (!existingEvent) {
      console.warn('Can\'t found event in calendar to update')
      
      return
    }

    // ---Set event properties except date related
    // Docs: https://fullcalendar.io/docs/Event-setProp
    // dateRelatedProps => ['start', 'end', 'allDay']
    for (let index = 0; index < propsToUpdate.length; index++) {
      const propName = propsToUpdate[index]

      existingEvent.setProp(propName, updatedEventData[propName])
    }

    // --- Set date related props
    // ? Docs: https://fullcalendar.io/docs/Event-setDates
    existingEvent.setDates(updatedEventData.start, updatedEventData.end, { allDay: updatedEventData.allDay })

    // --- Set event's extendedProps
    // ? Docs: https://fullcalendar.io/docs/Event-setExtendedProp
    for (let index = 0; index < extendedPropsToUpdate.length; index++) {
      const propName = extendedPropsToUpdate[index]

      existingEvent.setExtendedProp(propName, updatedEventData.extendedProps[propName])
    }
  }


  // 👉 Remove event in calendar [UI]
  const removeEventInCalendar = eventId => {
    const _event = calendarApi.value?.getEventById(eventId)
    if (_event)
      _event.remove()
  }


  // 👉 refetch events
  const refetchEvents = () => {
    calendarApi.value?.refetchEvents()
  }

  watch(() => store.selectedCalendars, refetchEvents)


  // 👉 Add event
  const addEvent = _event => {
    store.addEvent(_event)
      .then(() => {
        refetchEvents()
      })
  }


  // 👉 Update event
  const updateEvent = _event => {
    // ℹ️ Making API call using $api('', { method: ... })
    store.updateEvent(_event)
      .then(r => {
        const propsToUpdate = ['id', 'title', 'url']
        const extendedPropsToUpdate = ['calendar', 'guests', 'location', 'description']
        console.log(r);
        updateEventInCalendar(r.event, propsToUpdate, extendedPropsToUpdate)
      })
    refetchEvents()
  }


  // 👉 Remove event
  const removeEvent = eventId => {
    store.removeEvent(eventId).then(() => {
      removeEventInCalendar(eventId)
    })
  }

  // 👉 Calendar options
  const calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      start: 'drawerToggler,prev,next title',
      end: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
    },
    events: fetchEvents,

    // ❗ We need this to be true because when its false and event is allDay event and end date is same as start data then Full calendar will set end to null
    forceEventDuration: true,

    /*
        Enable dragging and resizing event
        Docs: https://fullcalendar.io/docs/editable
      */
    editable: false,

    /*
        Enable resizing event from start
        Docs: https://fullcalendar.io/docs/eventResizableFromStart
      */
    eventResizableFromStart: true,

    /*
        Automatically scroll the scroll-containers during event drag-and-drop and date selecting
        Docs: https://fullcalendar.io/docs/dragScroll
      */
    dragScroll: true,

    /*
        Max number of events within a given day
        Docs: https://fullcalendar.io/docs/dayMaxEvents
      */
    dayMaxEvents: 2,

    /*
        Determines if day names and week names are clickable
        Docs: https://fullcalendar.io/docs/navLinks
      */
    navLinks: true,
    eventClassNames({ event: calendarEvent }) {
      const colorName = calendarsColor[calendarEvent._def.extendedProps.calendar]
      
      return [
        // Background Color
        `bg-light-${colorName} text-${colorName}`,
      ]
    },
    eventClick({ event: clickedEvent, jsEvent }) {
      // Prevent the default action
      jsEvent.preventDefault()
      if (clickedEvent.url) {
        // Open the URL in a new tab
        window.open(clickedEvent.url, '_blank')
      }

      // * Only grab required field otherwise it goes in infinity loop
      // ! Always grab all fields rendered by form (even if it get `undefined`) otherwise due to Vue3/Composition API you might get: "object is not extensible"
      event.value = extractEventDataFromEventApi(clickedEvent)
      isEventHandlerSidebarActive.value = true
    },

    // customButtons
    dateClick(info) {
      event.value = { ...event.value, start: info.date }
      isEventHandlerSidebarActive.value = true
    },

    /*
          Handle event drop (Also include dragged event)
          Docs: https://fullcalendar.io/docs/eventDrop
          We can use `eventDragStop` but it doesn't return updated event so we have to use `eventDrop` which returns updated event
        */
    eventDrop({ event: droppedEvent }) {
      updateEvent(extractEventDataFromEventApi(droppedEvent))
    },

    /*
          Handle event resize
          Docs: https://fullcalendar.io/docs/eventResize
        */
    eventResize({ event: resizedEvent }) {
      if (resizedEvent.start && resizedEvent.end)
        updateEvent(extractEventDataFromEventApi(resizedEvent))
    },
    customButtons: {
      drawerToggler: {
        text: 'calendarDrawerToggler',
        click() {
          isLeftSidebarOpen.value = true
        },
      },
    },
  }


  // 👉 onMounted
  onMounted(() => {
    calendarApi.value = refCalendar.value.getApi()
  })


  // 👉 Jump to date on sidebar(inline) calendar change
  const jumpToDate = currentDate => {
    calendarApi.value?.gotoDate(new Date(currentDate))
  }

  watch(() => configStore.isAppRTL, val => {
    calendarApi.value?.setOption('direction', val ? 'rtl' : 'ltr')
  }, { immediate: true })
  
  return {
    refCalendar,
    calendarOptions,
    refetchEvents,
    fetchEvents,
    addEvent,
    updateEvent,
    removeEvent,
    jumpToDate,
  }
}
