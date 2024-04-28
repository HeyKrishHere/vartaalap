public class bestTimeToBuyAndSellStock {
    
        public static int maxProfit(int[] prices) {
            int maxdiff=Integer.MIN_VALUE;
            for(int i=1;i<prices.length;i++)
            {
                int currdiff=Integer.MIN_VALUE;
                for(int j=0;j<=+i;j++)
                {
                    int diff=prices[i]-prices[j];
                    currdiff=Math.max(currdiff,diff);
                }
                maxdiff=Math.max(maxdiff,currdiff);
            }
        return maxdiff;
            
        }
    public static void main(String[] args) 
        {
            int[] arr={7,1,5,3,6,4};
            int res=maxProfit(arr);
            System.out.println(res);
        }
    
}
