export function handleProjectCommand(projectNumber: string) {
  switch (projectNumber) {
    case '1':
      return 'Conways game of life'
    case '2':
      return <img src="client/components/extras/gg.gif" alt="Project 2" />
    case '3':
      return '┏(-_-)┛┗(-_-)┓ ┗(-_-)┛┏(-_-)┓'
    case '4':
      return <img src="client/components/extras/flopper.gif" alt="Project 4" />
    default:
      return 'Invalid project number. Please enter a valid project number (1, 2, or 3).'
  }
}
