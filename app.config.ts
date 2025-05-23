export default defineAppConfig({
  ui: {
    calendar: {
      slots: {
        root: 'bg-[#A0576F] px-[15px] py-[17px] rounded-[12px]',
        header: 'flex items-center justify-between text-white calendar-header',
        body: 'flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0',
        heading: 'text-center font-medium truncate mx-auto text-white',
        grid: 'w-full border-collapse select-none space-y-1 focus:outline-none ',
        gridRow: 'grid grid-cols-7 place-items-center',
        gridWeekDaysRow: 'mb-1 grid w-full grid-cols-7',
        gridBody: 'grid',
        headCell: 'rounded-md',
        cell: 'relative text-center',
        cellTrigger: [
          'm-0.5 relative flex items-center justify-center rounded-full whitespace-nowrap focus-visible:ring-2 focus:outline-none data-disabled:text-white data-unavailable:line-through data-unavailable:text-white data-unavailable:pointer-events-none data-[selected]:text-inverted data-today:font-semibold data-[outside-view]:text-white',
          'transition'
        ]
      },
      variants: {
        color: {
          primary: {
            headCell: 'text-[16px] font-normal text-center text-white',
            cellTrigger: 'text-white focus-visible:ring-primary data-[selected]:bg-white data-[selected]:text-[#A0576F] data-today:not-data-[selected]:text-white data-[highlighted]:bg-white hover:not-data-[selected]:bg-white hover:not-data-[selected]:text-[#A0576F]'
          },
          secondary: {
            headCell: 'text-secondary',
            cellTrigger: 'focus-visible:ring-secondary data-[selected]:bg-secondary data-today:not-data-[selected]:text-secondary data-[highlighted]:bg-secondary/20 hover:not-data-[selected]:bg-secondary/20'
          },
          success: {
            headCell: 'text-success',
            cellTrigger: 'focus-visible:ring-success data-[selected]:bg-success data-today:not-data-[selected]:text-success data-[highlighted]:bg-success/20 hover:not-data-[selected]:bg-success/20'
          },
          info: {
            headCell: 'text-info',
            cellTrigger: 'focus-visible:ring-info data-[selected]:bg-info data-today:not-data-[selected]:text-info data-[highlighted]:bg-info/20 hover:not-data-[selected]:bg-info/20'
          },
          warning: {
            headCell: 'text-warning',
            cellTrigger: 'focus-visible:ring-warning data-[selected]:bg-warning data-today:not-data-[selected]:text-warning data-[highlighted]:bg-warning/20 hover:not-data-[selected]:bg-warning/20'
          },
          error: {
            headCell: 'text-error',
            cellTrigger: 'focus-visible:ring-error data-[selected]:bg-error data-today:not-data-[selected]:text-error data-[highlighted]:bg-error/20 hover:not-data-[selected]:bg-error/20'
          },
          neutral: {
            headCell: 'text-highlighted',
            cellTrigger: 'focus-visible:ring-inverted data-[selected]:bg-inverted data-today:not-data-[selected]:text-highlighted data-[highlighted]:bg-inverted/20 hover:not-data-[selected]:bg-inverted/10'
          }
        },
        size: {
          xs: {
            heading: 'text-xs',
            cell: 'text-xs',
            headCell: 'text-[10px]',
            cellTrigger: 'size-7',
            body: 'space-y-2 pt-2'
          },
          sm: {
            heading: 'text-xs',
            headCell: 'text-xs',
            cell: 'text-xs',
            cellTrigger: 'size-7'
          },
          md: {
            heading: 'text-sm',
            headCell: 'text-xs',
            cell: 'text-sm',
            cellTrigger: 'size-8'
          },
          lg: {
            heading: 'text-md',
            headCell: 'text-md',
            cellTrigger: 'size-9 text-md'
          },
          xl: {
            heading: 'text-lg',
            headCell: 'text-lg',
            cellTrigger: 'size-10 text-lg'
          }
        }
      },
      defaultVariants: {
        size: 'md',
        color: 'primary'
      }
    },



    tabs: {
      slots: {
      },

      compoundVariants: [

        {
          color: 'primary',
          variant: 'pill',
          class: {
            indicator: 'bg-transparent',
          }
        },

      ],
    },
    progress: {

      slots: {
        root: '',
        base: '!h-[4px] bg-white/50',
        indicator: '!h-[4px]',
        status: 'flex justify-end text-dimmed transition-[width] duration-200',
        steps: 'grid items-end',
        step: 'truncate text-end row-start-1 col-start-1 transition-opacity'
      },

      variants: {

        color: {
          primary: {
            indicator: 'bg-[#AA847B]',
          },
        },
      }

    }
  }
})


