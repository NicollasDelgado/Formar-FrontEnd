import { Controller } from 'react-hook-form'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { InputProps } from './input-props'
import { TextField } from '@mui/material'

dayjs.locale('pt-br')

export const InputDate = ({
  name,
  control,
  label,
  disabled,
  onChange: externalOnChange,
}: InputProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const value = field.value ? dayjs(field.value, 'DD/MM/YYYY') : null

        return (
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <DatePicker
              label={label}
              value={value}
              onChange={(newValue) => {
                const formattedDate = newValue
                  ? newValue.format('DD/MM/YYYY')
                  : ''

                // Atualiza o react-hook-form
                field.onChange(formattedDate)

                // Chama o onChange personalizado
                if (externalOnChange) {
                  externalOnChange(formattedDate)
                }
              }}
              format="DD/MM/YYYY"
              readOnly={disabled}
              slots={{ textField: TextField }}
              slotProps={{
                textField: {
                  error: !!error,
                  helperText: error?.message,
                  fullWidth: true,
                  variant: 'standard',
                  size: 'small',
                  disabled,
                },
              }}
            />
          </LocalizationProvider>
        )
      }}
    />
  )
}
