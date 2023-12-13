# spawn `npx -y tsx 2023/12/2` 12 times with BATCH_INDEX env variable incremented by 1 each time

for i in {0..19}
do
  BATCH_INDEX=$i ts-node 2 > 2-out/2.$i.out &
done

# stop: pkill -f ts-node