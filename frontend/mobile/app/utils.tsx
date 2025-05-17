export const serviceStatusDist = (services): [number, number, number, number,number] => {
    let [open, inProgress, completed,pending, cancelled] = [0, 0, 0, 0,0];
  
    if (!Array.isArray(services)) {
      console.error('ServiceStatusDist: services must be an array');
      return [open, inProgress, completed, pending,cancelled,];
    }
  
    services.forEach((service) => {
      switch (service.status) {
        case 'Open':
          open += 1;
          break;
        case 'In Progress':
          inProgress += 1;
          break;
        case 'Completed':
          completed += 1;
          break;
        case 'Cancelled':
          cancelled += 1;
          break;
        case "Pending" :
          pending+=1;
          break;
        default:
          console.warn(`Unknown service status: ${service.status}`);
      }
    });
  
    return [open, inProgress, completed, cancelled,pending];
  };

export const TotalEarnings=(jobs:any)=>{
  let total=0
  jobs.forEach(job => {
    total+=job.budget
  });
  return total
}

export const earnData=(jobs:any)=>{
  let data=[]
  jobs.forEach(job=>{
    data.push(job.budget)
  })
  return data
}
export const getMonth=(table:any)=>{
  let months=[]
  table.forech(element=>{
    const formattedDate = new Date(element.updated_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    months.push(formattedDate)
  })
  return months
}

 export  const getImageUrl = (url: string | undefined,backendUrl) => {
    if (!url) return null;
    console.log('Original image URL:', url);
    
    if (url.startsWith('http')) {
      console.log('Using absolute URL:', url);
      return url;
    }
    
    const fullUrl = `${backendUrl}${url}`;
    console.log('Constructed image URL:', fullUrl)
    return fullUrl;
  };