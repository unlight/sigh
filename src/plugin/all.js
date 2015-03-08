import Bacon from 'baconjs'
import _ from 'lodash'

import { bufferingDebounce } from '../stream'

var DEFAULT_DEBOUNCE = 200

export default function(op, ...pipelines) {
  // probably not the best way to detect option argument...
  var opts = _.assign(
    { debounce: DEFAULT_DEBOUNCE }, pipelines[0].debounce ? pipelines.shift() : {}
  )

  var streams = pipelines.map(pipeline => op.compiler.compile(pipeline, op.stream))
  var combined = bufferingDebounce(Bacon.mergeAll(streams), opts.debounce).map(_.flatten)
  return op.stream ? op.stream.map(combined) : combined
}
