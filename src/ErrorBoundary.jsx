import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props){
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error){
    return { hasError: true, error };
  }
  componentDidCatch(error, info){
    if (typeof window !== 'undefined' && window?.console){
      console.error('[ErrorBoundary]', error, info);
    }
  }
  handleRetry = () => {
    this.setState({ hasError:false, error:null });
  };
  render(){
    if (this.state.hasError){
      return (
        <div style={{padding:'40px 20px', fontFamily:'Inter, system-ui, sans-serif', maxWidth:520, margin:'0 auto', textAlign:'center'}}>
          <h1 style={{fontSize:'1.6rem', margin:'0 0 12px'}}>Something went wrong</h1>
          <p style={{margin:'0 0 20px', lineHeight:1.4}}>An unexpected error occurred. You can try again or reload the page.</p>
          <div style={{display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap'}}>
            <button onClick={this.handleRetry} style={{background:'#a67c52', color:'#fff', border:'none', padding:'10px 18px', borderRadius:24, cursor:'pointer'}}>Try Again</button>
            <button onClick={()=>window.location.reload()} style={{background:'#3e2723', color:'#fff', border:'none', padding:'10px 18px', borderRadius:24, cursor:'pointer'}}>Reload</button>
          </div>
          {process.env.NODE_ENV === 'development' && this.state.error && (
            <pre style={{marginTop:24, textAlign:'left', whiteSpace:'pre-wrap', fontSize:12, background:'#f2eee8', padding:12, borderRadius:8}}>{String(this.state.error.stack || this.state.error)}</pre>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;