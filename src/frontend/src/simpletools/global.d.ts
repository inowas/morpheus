declare global {
  interface Window {
    Plotly?: IPlotly
  }

  interface IPlotly {
    newPlot: (id: string, data: any[], layout: any, config: any) => void
  }
}

export {};
