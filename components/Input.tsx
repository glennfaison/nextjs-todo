type Props = Readonly<React.InputHTMLAttributes<HTMLInputElement>>

export function Input({ className, ...props }: Props) {
  return (
    <input
      className={'mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 ' + className}
      {...props}
    />
  )
}
