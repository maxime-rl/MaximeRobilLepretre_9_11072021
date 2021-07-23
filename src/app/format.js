export const formatDate = (dateStr) => {
  if (Date.parse(dateStr) === NaN || dateStr === "") return "01.01.21"; // Bug invalid dates in DB => replace invalid dates by other valid dates
  const date = new Date(dateStr)
  const ye = new Intl.DateTimeFormat('fr', { year: 'numeric' }).format(date)
  const mo = new Intl.DateTimeFormat('fr', { month: '2-digit' }).format(date)
  const da = new Intl.DateTimeFormat('fr', { day: '2-digit' }).format(date)
  return `${da}.${mo}.${ye.toString().substr(2,4)}`
}

export const formatStatus = (status) => {
  switch (status) {
    case "pending":
      return "En attente"
    case "accepted":
      return "Accepté"
    case "refused":
      return "Refused"
  }
}